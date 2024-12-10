import { AuthorityEnumType, MANAGING_AUTHORITIES } from '@enums/authority.enum';
import { Member } from '@domain/meeting/entity/member.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { MemberDao } from '@domain/meeting/dao/member.dao.interface';
import { AuthorityComponent } from './authority.component.interface';

@Injectable()
export class AuthorityComponentImpl implements AuthorityComponent {
  constructor(private memberDao: MemberDao) {}

  public async validateAuthority(
    requester_id: number,
    meetingId: number,
    validAuthorities: AuthorityEnumType[] = MANAGING_AUTHORITIES,
  ): Promise<void> {
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);

    if (!member || !validAuthorities.includes(member.authority)) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }
  }
}
