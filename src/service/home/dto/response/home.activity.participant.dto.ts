import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';

export class HomeActivityParticipantDto {
  @ApiProperty()
  thumbnail: string;

  @ApiProperty({
    enum: AuthorityEnum,
    example: AuthorityEnum.OWNER,
  })
  authority: AuthorityEnumType;
}
