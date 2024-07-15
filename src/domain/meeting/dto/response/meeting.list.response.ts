import { ApiProperty } from '@nestjs/swagger';
import { MeetingListMeetingDto } from './meeting.list.meeting.dto';

export class MeetingListResponse {
  @ApiProperty()
  meetingList: MeetingListMeetingDto[];
}
