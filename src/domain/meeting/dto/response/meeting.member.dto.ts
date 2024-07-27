import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnum, AuthorityEnumType } from '../../../../enums/authority.enum';

export class MeetingMemberDto {
  @ApiProperty()
  username: string;

  @ApiProperty({
    enum: AuthorityEnum,
  })
  authority: AuthorityEnumType;
}
