import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';

export interface ScheduleService {
  createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string>;
}
