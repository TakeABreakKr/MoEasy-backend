import { ApiProperty } from '@nestjs/swagger';
import { ActivityListDto } from '@service/activity/dto/response/activity.list.dto';
import { ActivityListMeetingListDto } from '@service/activity/dto/response/activity.list.meeting.list.dto';

export class ActivityListResponse {
  @ApiProperty({
    type: ActivityListDto,
    isArray: true,
  })
  activityList: ActivityListDto[];

  @ApiProperty({
    type: ActivityListMeetingListDto,
    isArray: true,
  })
  meetings: ActivityListMeetingListDto[];
}
