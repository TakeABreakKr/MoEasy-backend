import { ApiProperty } from '@nestjs/swagger';
import { ScheduleListDto } from '@service/schedule/dto/response/schedule.list.dto';
import { ScheduleListMeetingListDto } from '@service/schedule/dto/response/schedule.list.meeting.list.dto';

export class ScheduleListResponse {
  @ApiProperty({
    type: ScheduleListDto,
    isArray: true,
  })
  scheduleList: ScheduleListDto[];

  @ApiProperty({
    type: ScheduleListMeetingListDto,
    isArray: true,
  })
  meetings: ScheduleListMeetingListDto[];
}
