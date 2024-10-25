import { ScheduleRequest } from '@domain/schedule/dto/request/base.schedule.request';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleCreateRequest extends ScheduleRequest {
  @ApiProperty()
  participants: number[];
}
