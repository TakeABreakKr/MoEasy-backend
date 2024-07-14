import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnumType } from '../../../../enums/authority.enum';

export class GetMeetingMemberDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  authority: AuthorityEnumType;
}
