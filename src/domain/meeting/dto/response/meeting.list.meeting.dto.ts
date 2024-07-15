import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnumType } from '../../../../enums/authority.enum';

export class MeetingListMeetingDto {
  @ApiProperty()
  meetingId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  authority?: AuthorityEnumType;
}
