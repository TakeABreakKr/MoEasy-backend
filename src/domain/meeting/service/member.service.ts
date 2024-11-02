import type { Users } from '@domain/user/entity/users.entity';

import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { UsersDao } from '@domain/user/dao/users.dao';
import { MemberDao } from '../dao/member.dao';
import { MeetingDao } from '../dao/meeting.dao';
import { MeetingUtils } from '@utils/meeting.utils';
import { Member } from '../entity/member.entity';
import { AuthorityEnum, MANAGING_AUTHORITIES } from '@enums/authority.enum';
import { MemberService } from './member.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberJoinRequest } from '@domain/meeting/dto/request/member.join.request';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { SortUtils } from '@utils/sort.utils';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberWaitingListDto } from '@domain/meeting/dto/response/member.waiting.list.dto';
import { MemberWaitingListResponse } from '@domain/meeting/dto/response/member.waiting.list.response';
import { MemberWaitingListMeetingDto } from '@domain/meeting/dto/response/member.waiting.list.meeting.dto';

@Injectable()
export class MemberServiceImpl implements MemberService {
  constructor(
    private usersDao: UsersDao,
    private memberDao: MemberDao,
    private meetingDao: MeetingDao,
    private notificationComponent: NotificationComponent,
    private authorityComponent: AuthorityComponent,
  ) {}

  public async search(keyword: string): Promise<MemberSearchResponse> {
    keyword.trim(); // 에러 안나오게 깡통 처리
    return {
      memberList: [],
    }; // TODO: develop after friend system
  }

  public async getMember(meeting_id: string, user_id: number) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(user_id, meetingId);
    const user: Users | null = await this.usersDao.findById(user_id);
    if (!user || !member) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);

    return {
      username: user.username,
      explanation: user.explanation,
      authority: member.authority,
    };
  }

  @Transactional()
  public async withdraw(requester_id: number, meeting_id: string) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const user: Users | null = await this.usersDao.findById(requester_id);
    if (!user) throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);

    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member) throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);

    let content = user.username + '님이 모임에서 탈퇴하였습니다.';
    await this.notificationComponent.addNotificationToMeetingMembers(content, meetingId);
    const members = await this.memberDao.findByMeetingId(meetingId);

    if (member.authority === AuthorityEnum.OWNER) {
      const owner: Member = this.getNewOwner(members);
      await this.memberDao.updateAuthority(owner, AuthorityEnum.OWNER);

      content = (await owner.getUser()).username + ' 님이 모임장이 되었습니다.';
      await this.notificationComponent.addNotificationToMeetingMembers(content, meetingId);
    }
    await this.memberDao.deleteByUsersAndMeetingId(requester_id, meetingId);

    content = user.username + '님이 모임에서 탈퇴하였습니다.';
    await this.notificationComponent.addNotificationToMeetingMembers(content, meetingId);
  }

  private getNewOwner(members: Member[]): Member {
    const managers = members.filter((member) => member.authority === AuthorityEnum.MANAGER);
    const managerRandomIndex: number = Math.floor(Math.random() * managers.length);
    return managers[managerRandomIndex] || members[Math.floor(Math.random() * members.length)];
  }

  @Transactional()
  public async updateAuthority(requester_id: number, req: MemberAuthorityUpdateRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requester_id, meetingId, [AuthorityEnum.OWNER]);

    const member = await this.memberDao.findByUsersAndMeetingId(req.usersId, meetingId);
    if (member.authority === AuthorityEnum.MEMBER && req.isManager) {
      await this.memberDao.updateAuthority(member, AuthorityEnum.MANAGER);
    }
  }

  @Transactional()
  public async deleteMember(requester_id: number, req: MemberDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);

    await this.memberDao.deleteByUsersAndMeetingId(req.memberId, meetingId);
  }

  @Transactional()
  public async join(requester_id: number, req: MemberJoinRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    const meeting = await this.meetingDao.findByMeetingId(meetingId);
    if (meeting.canJoin) throw new BadRequestException(ErrorMessageType.JOIN_REQUEST_DISABLED);
    await this.memberDao.create({
      meetingId,
      usersId: requester_id,
      authority: AuthorityEnum.WAITING,
      applicationMessage: req.applicationMessage,
    });
  }

  @Transactional()
  public async getWaitingList(requester_id: number): Promise<MemberWaitingListResponse> {
    const members = await this.memberDao.findByUsersAndAuthorities(requester_id, MANAGING_AUTHORITIES);
    const meetingIds: number[] = members.map((member) => member.meeting_id);

    const response: MemberWaitingListResponse = {
      meetings: [],
    };
    for (const meetingId of meetingIds) {
      const memberList: MemberWaitingListDto[] = await this.getMemberWaitingListDtos(meetingId);
      const meeting = await this.meetingDao.findByMeetingId(meetingId);
      const meetingDto: MemberWaitingListMeetingDto = {
        name: meeting.name,
        members: memberList,
      };
      response.meetings.push(meetingDto);
    }
    return response;
  }

  private async getMemberWaitingListDtos(meetingId: number): Promise<MemberWaitingListDto[]> {
    const members = await this.memberDao.findByMeetingId(meetingId);

    const filteredMembers = members.filter((member: Member) => member.authority === AuthorityEnum.WAITING);
    const sortedMembers = SortUtils.sort<Member>(filteredMembers, OrderingOptionEnum.OLDEST);

    const userIds: number[] = sortedMembers.map((member: Member) => member.users_id);
    const userList: Users[] = await this.usersDao.findByIds(userIds);
    const usernameMap: Map<number, string> = new Map();
    userList.forEach((user) => {
      usernameMap.set(user.users_id, user.username);
    });

    return sortedMembers.map((member) => {
      const username: string = usernameMap.get(member.users_id);
      return {
        name: username,
        applicationMessage: member.applicationMessage,
      };
    });
  }

  @Transactional()
  public async manageMemberJoin(requesterId: number, req: MemberJoinManageRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requesterId, meetingId);
    await this.authorityComponent.validateAuthority(req.memberId, meetingId, [AuthorityEnum.WAITING]);

    const member = await this.memberDao.findByUsersAndMeetingId(req.memberId, meetingId);
    const user = await member.getUser();
    if (req.isAccepted) {
      await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);

      const content = user.username + '님의 가입이 수락되었습니다.';
      await this.notificationComponent.addNotificationToMeetingMembers(content, meetingId);
    } else {
      const content = user.username + '님의 가입이 거절되었습니다.';
      await this.memberDao.deleteByUsersAndMeetingId(req.memberId, meetingId);
      await this.notificationComponent.addNotification(content, requesterId);
    }
  }
}
