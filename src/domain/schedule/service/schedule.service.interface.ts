import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';

export interface ScheduleService {
  createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string>;
  updateSchedule(req: ScheduleUpdateRequest): Promise<void>;
  getScheduleList(meeting_id: string, requester_id: number): Promise<ScheduleListResponse>;
}
