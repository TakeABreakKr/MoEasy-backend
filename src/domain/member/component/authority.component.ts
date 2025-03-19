import { AuthorityEnumType, MANAGING_AUTHORITIES } from '@enums/authority.enum';
import { Member } from '@domain/member/entity/member.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';

@Injectable()
export class AuthorityComponentImpl implements AuthorityComponent {
  constructor(@Inject('MemberDao') private memberDao: MemberDao) {}

  public async validateAuthority(
    requesterId: number,
    meetingId: number,
    validAuthorities: AuthorityEnumType[] = MANAGING_AUTHORITIES,
  ): Promise<void> {
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requesterId, meetingId);

    if (!member) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);
    }

    if (!validAuthorities.includes(member.authority)) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }
  }
}
