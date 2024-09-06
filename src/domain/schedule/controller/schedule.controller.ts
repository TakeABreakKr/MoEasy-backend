import { Body, Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
//import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(@Inject('ScheduleService') private readonly scheduleService: ScheduleService) {}

  async createSchedule(@Body() request: ScheduleCreateRequest): Promise<string> {
    const requester_id = 0; // PLAN : getRequester info from token
    //권한 확인?
    //시작날짜가 끝나는날짜보다 앞서지않게 막기
    return this.scheduleService.createSchedule(request, requester_id);
  }
}
