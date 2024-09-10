import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';

export class ScheduleServiceImpl implements ScheduleService {
  async createSchedule(req: ScheduleCreateRequest): Promise<string> {
  }
}
