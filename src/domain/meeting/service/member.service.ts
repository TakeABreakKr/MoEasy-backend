import type { Users } from '@domain/user/entity/users.entity';

import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { UsersDao } from '@domain/user/dao/users.dao';
import { MemberDao } from '../dao/member.dao';
import { MemberInviteRequest } from '../dto/request/member.invite.request';
import { MeetingUtils } from '@utils/meeting.utils';
import { Member } from '../entity/member.entity';
import { AuthorityEnum, AuthorityEnumType, MANAGING_AUTHORITIES } from '@enums/authority.enum';
import { MemberService } from './member.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { AuthorityComponent } from '@domain/user/component/authority.component';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberAuthorityModifyRequest } from '@domain/meeting/dto/request/member.authority.modify.request';

@Injectable()
export class MemberServiceImpl implements MemberService {
  constructor(
    private configService: ConfigService,
    private usersDao: UsersDao,
    private memberDao: MemberDao,
    private readonly notificationComponent: NotificationComponent,
    private readonly authorityComponent: AuthorityComponent,
  ) {}

  public async search(keyword: string): Promise<MemberSearchResponse> {
    return {
      memberList: [],
    }; // TODO: develop after friend system
  }

  public async get(meeting_id: string, user_id: number) {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const member = await this.memberDao.findByUsersAndMeetingId(user_id, meetingId);
    const user = await this.usersDao.findById(user_id);
    if (!user) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);
    return {
      username: user.username,
      explanation: '안녕하세요?',
      authority: member.authority,
    }; //이걸로 그냥 response에 담긴다니 미친거 아님?
  }

  @Transactional()
  public async withdraw(requester_id: number, meeting_id: string) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const user = await this.usersDao.findById(requester_id);
    if (!user) throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);

    const member = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member) throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    let content = user.username + '님이 모임에서 탈퇴하셨습니다.';
    const members = await this.memberDao.findByMeetingId(meetingId);
    members.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));

    if (member.authority === AuthorityEnum.OWNER) {
      const managers = members.filter((member) => member.authority === AuthorityEnum.MANAGER);
      if (managers.length === 0) {
        const owner = this.select(members);
        await this.updateAuthority(owner, AuthorityEnum.OWNER);
      }
      const owner = this.select(managers);
      await this.updateAuthority(owner, AuthorityEnum.OWNER);
      content = (await owner.getUser()).username + ' 님이 모임장이 되었습니다.';
      members.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));
    }

    await this.memberDao.deleteByUsersAndMeetingId(requester_id, meetingId);
  }

  public select(members: Member[]): Member {
    return members[Math.random() * members.length];
  }

  public async updateAuthority(member: Member, authorityEnum: AuthorityEnumType): Promise<void> {
    await this.memberDao.updateAuthority(member, authorityEnum);
  }

  @Transactional()
  public async modifyAuthority(requester_id: number, req: MemberAuthorityModifyRequest) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requester_id, meetingId, [AuthorityEnum.OWNER]);

    const member = await this.memberDao.findByUsersAndMeetingId(req.usersId, meetingId);
    if (member.authority === AuthorityEnum.MEMBER && req.manager) {
    }
  }

  @Transactional()
  public async delete(requester_id: number, req: MemberDeleteRequest): Promise<void> {
    console.log(requester_id);
    console.log(req);
  }

  @Transactional()
  public async invite(requester_id: number, req: MemberInviteRequest): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.validateInviteRequester(requester_id, meetingId);

    const member: Member = await this.memberDao.create({
      meetingId,
      usersId: req.newMemberId,
      authority: AuthorityEnum.WAITING,
    });
    return this.createInvitationAcceptUrl(member.users_id, member.meeting_id);
  }

  @Transactional()
  public async accept(requester_id: number, usersId: number, meetingId: string) {
    if (requester_id !== usersId) {
      throw new UnauthorizedException(ErrorMessageType.WRONG_INVITE_URL);
    }

    const meeting_id: number = MeetingUtils.transformMeetingIdToInteger(meetingId);
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(usersId, meeting_id);
    if (!member) {
      throw new BadRequestException(ErrorMessageType.MALFORMED_INVITE_URL);
    }
    await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);

    const user = await member.getUser();
    const content = user.username + '님의 가입이 수락되었습니다.';
    const memberList = await this.memberDao.findByMeetingId(meeting_id);
    memberList.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));
  }

  @Transactional()
  public async approve(requesterId: number, usersId: number, meetingId: string) {
    // 초대 플로우 수정 : approve와 accept 둘 중 하나
    const meeting_id: number = MeetingUtils.transformMeetingIdToInteger(meetingId);
    const requester: Member | null = await this.memberDao.findByUsersAndMeetingId(requesterId, meeting_id);
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(usersId, meeting_id);

    if (!requester || !MANAGING_AUTHORITIES.includes(requester.authority)) {
      throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
    if (!member || member.authority !== AuthorityEnum.WAITING) {
      throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
    await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);

    const user = await member.getUser();
    const content = user.username + '님의 가입이 수락되었습니다.';
    const memberList = await this.memberDao.findByMeetingId(meeting_id);
    memberList.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));
  }

  private async validateInviteRequester(users_id: number, meetingId: number) {
    const user: Users | null = await this.usersDao.findById(users_id);
    if (!user) {
      throw new UnauthorizedException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }

    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(users_id, meetingId);
    if (!member) {
      throw new ForbiddenException(ErrorMessageType.FORBIDDEN_INVITE_REQUEST);
    }
  }

  private createInvitationAcceptUrl(users_id: number, meeting_id: number): string {
    const meetingId: string = MeetingUtils.transformMeetingIdToString(meeting_id);
    const host: string = this.configService.get('host');
    return `${host}/member/invite/accept?usersId=${users_id}&meetingId=${meetingId}`;
  }
}
