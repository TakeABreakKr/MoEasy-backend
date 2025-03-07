import { ApiProperty } from '@nestjs/swagger';
import { MeetingListMeetingDto } from '@service/meeting/dto/response/meeting.list.meeting.dto';

export class MeetingListResponse {
  @ApiProperty({
    type: MeetingListMeetingDto,
    isArray: true,
  })
  meetingList: MeetingListMeetingDto[];
}
