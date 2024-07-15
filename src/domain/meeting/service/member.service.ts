import type { Users } from '../../user/entity/users.entity';

import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { ConfigService } from '@nestjs/config';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { UsersDao } from '../../user/dao/users.dao';
import { MeetingDao } from '../dao/meeting.dao';
import { MemberDao } from '../dao/member.dao';
import { MemberInviteRequest } from '../dto/request/member.invite.request';
import { MeetingUtils } from '../../../utils/meeting.utils';
import { Member } from '../entity/member.entity';
import { AuthorityEnum } from '../../../enums/authority.enum';

@Injectable()
export class MemberService {
  constructor(
    private configService: ConfigService,
    private usersDao: UsersDao,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
  ) {}

  public async search(keyword: string): Promise<MemberSearchResponse> {
    return null; // TODO: develop after friend system
  }

  @Transactional()
  public async withdraw(requester_id: number, meeting_id: string) {}

  @Transactional()
  public async invite(requester_id: number, req: MemberInviteRequest): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.validateInviteRequester(requester_id, meetingId);

    const member: Member = await this.memberDao.create({ meetingId, usersId: req.newMemberId });
    return this.createInvitationAcceptUrl(member.users_id, member.meeting_id);
  }

  @Transactional()
  public async accept(requester_id: number, usersId: number, meetingId: string) {
    if (requester_id !== usersId) {
      throw new Error('invitation not for requester');
    }

    const meeting_id: number = MeetingUtils.transformMeetingIdToInteger(meetingId);
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(usersId, meeting_id);
    if (!member) {
      throw new Error('invite url malformed');
    }

    await this.memberDao.updateAuthority(member, AuthorityEnum.MEMBER);
  }

  private async validateInviteRequester(users_id: number, meetingId: number) {
    const user: Users | null = await this.usersDao.findById(users_id);
    if (!user) {
      throw new Error('requester is not exists');
    }

    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(users_id, meetingId);
    if (!member) {
      throw new Error('only members of meeting are able to request invitation');
    }
  }

  private createInvitationAcceptUrl(users_id: number, meeting_id: number): string {
    const meetingId: string = MeetingUtils.transformMeetingIdToString(meeting_id);
    const host: string = this.configService.get('host');
    return `${host}/member/invite/accept?usersId=${users_id}&meetingId=${meetingId}`;
  }
}
