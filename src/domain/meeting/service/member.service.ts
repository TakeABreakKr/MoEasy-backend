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
import { AuthorityEnum } from '@enums/authority.enum';
import { MemberService } from './member.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationComponent } from '@domain/notification/component/notification.component';

@Injectable()
export class MemberServiceImpl implements MemberService {
  constructor(
    private configService: ConfigService,
    private usersDao: UsersDao,
    private memberDao: MemberDao,
    private readonly notificationComponent: NotificationComponent,
  ) {}

  public async search(keyword: string): Promise<MemberSearchResponse> {
    return {
      memberList: [],
    }; // TODO: develop after friend system
  }

  @Transactional()
  public async withdraw(requester_id: number, meeting_id: string) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    await this.memberDao.deleteByUsersAndMeetingId(requester_id, meetingId);

    const content = '모임에서 탈퇴하셨습니다.';
    await this.notificationComponent.addNotification(content, requester_id);
  }

  @Transactional()
  public async invite(requester_id: number, req: MemberInviteRequest): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.validateInviteRequester(requester_id, meetingId);

    const member: Member = await this.memberDao.create({
      meetingId,
      usersId: req.newMemberId,
      authority: AuthorityEnum.INVITED,
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

    const content = '모임 가입이 수락되었습니다.';
    await this.notificationComponent.addNotification(content, usersId);
  }

  @Transactional()
  public async approve(requesterId: number, usersId: number, meetingId: string) {
    const meeting_id: number = MeetingUtils.transformMeetingIdToInteger(meetingId);
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(usersId, meeting_id);
    const requester: Member | null = await this.memberDao.findByUsersAndMeetingId(requesterId, meeting_id);
    if (!requester || requester.authority !== AuthorityEnum.OWNER) {
      throw new Error('Requester does not have the authority to approve members');
    }
    if (!member || member.authority !== AuthorityEnum.WAITING) {
      throw new Error('no member found');
    }
    await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);

    const content = '모임 가입이 수락되었습니다.';
    await this.notificationComponent.addNotification(content, usersId);
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
