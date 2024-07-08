import { ApiProperty } from '@nestjs/swagger';
import { GetMeetingListMeetingDto } from './get.meeting.list.meeting.dto';

export class GetMeetingListResponse {
  @ApiProperty()
  meetingList: GetMeetingListMeetingDto[];
}
