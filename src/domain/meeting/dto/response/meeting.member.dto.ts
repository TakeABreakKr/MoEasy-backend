import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnumType } from '../../../../enums/authority.enum';

export class MeetingMemberDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  authority: AuthorityEnumType;
}
