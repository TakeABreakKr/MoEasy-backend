import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';

export class ActivityParticipantDto {
  @ApiProperty()
  thumbnail: string;

  @ApiProperty({
    enum: AuthorityEnum,
    example: AuthorityEnum.OWNER,
  })
  authority: AuthorityEnumType;
}
