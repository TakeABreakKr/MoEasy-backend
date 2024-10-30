import type { Users } from '@domain/user/entity/users.entity';

import { BadRequestException, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { UsersDao } from '@domain/user/dao/users.dao';
import { MemberDao } from '../dao/member.dao';
import { MeetingUtils } from '@utils/meeting.utils';
import { Member } from '../entity/member.entity';
import { AuthorityEnum } from '@enums/authority.enum';
import { MemberService } from './member.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberApplyRequest } from '@domain/meeting/dto/request/member.apply.request';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { SortUtils } from '@utils/sort.utils';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { MemberWaitingListDto } from '@domain/meeting/dto/response/member.waiting.list.dto';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';

@Injectable()
export class MemberServiceImpl implements MemberService {
  constructor(
    private configService: ConfigService,
    private usersDao: UsersDao,
    private memberDao: MemberDao,
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
  public async delete(requester_id: number, req: MemberDeleteRequest): Promise<void> {
    // TODO : API 확인 후 개발 진행
    requester_id || req; // 에러 안나오게 깡통 처리
  }

  @Transactional()
  public async apply(requester_id: number, req: MemberApplyRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);

    await this.memberDao.create({
      meetingId,
      usersId: requester_id,
      authority: AuthorityEnum.WAITING,
      applicationMessage: req.applicationMessage,
    });
  }

  @Transactional()
  public async getWaiting(requester_id: number, meeting_id: string) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);

    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const members = await this.memberDao.findByMeetingId(meetingId);

    const filteredMembers = members.filter((member: Member) => member.authority === AuthorityEnum.WAITING);
    SortUtils.sort<Member>(filteredMembers, OrderingOptionEnum.OLDEST);

    const waitingList: MemberWaitingListDto[] = await Promise.all(
      filteredMembers.map(async (member) => {
        const users = await member.getUser();
        return {
          name: users.username,
          applicationMessage: member.applicationMessage,
        };
      }),
    );

    return waitingList;
  }

  @Transactional()
  public async manageMemberJoin(requesterId: number, req: MemberJoinManageRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requesterId, meetingId);
    await this.authorityComponent.validateAuthority(req.memberId, meetingId, [AuthorityEnum.WAITING]);

    const member = await this.memberDao.findByUsersAndMeetingId(req.memberId, meetingId);
    if (req.isAccepted) {
      await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);

      const user = await member.getUser();
      const content = user.username + '님의 가입이 수락되었습니다.';
      await this.notificationComponent.addNotificationToMeetingMembers(content, meetingId);
    } else {
      await this.memberDao.deleteByUsersAndMeetingId(req.memberId, meetingId);
    }
  }
}
