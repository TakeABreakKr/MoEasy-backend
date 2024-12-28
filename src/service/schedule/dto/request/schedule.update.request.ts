import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { ScheduleRequest } from '@service/schedule/dto/request/base.schedule.request';

export class ScheduleUpdateRequest extends ScheduleRequest {
  @ApiProperty()
  @IsNotEmpty()
  schedule_id: number;
}
