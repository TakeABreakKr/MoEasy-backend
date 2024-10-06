import { ApiProperty } from '@nestjs/swagger';
import { ScheduleListDto } from '@domain/schedule/dto/response/schedule.list.dto';

export class ScheduleListResponse {
  @ApiProperty({
    type: ScheduleListDto,
    isArray: true,
  })
  scheduleList: ScheduleListDto[];
}
