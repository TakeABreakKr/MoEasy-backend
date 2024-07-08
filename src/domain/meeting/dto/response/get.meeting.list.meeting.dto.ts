import { ApiProperty } from '@nestjs/swagger';

export class GetMeetingListMeetingDto {
  @ApiProperty()
  meetingId: string;
}
