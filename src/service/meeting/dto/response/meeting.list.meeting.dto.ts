import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';

export class MeetingListMeetingDto {
  @ApiProperty()
  meetingId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty({
    enum: AuthorityEnum,
  })
  authority?: AuthorityEnumType;

  @ApiProperty()
  canJoin: boolean;
}
