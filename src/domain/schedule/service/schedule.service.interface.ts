import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleStatusEnumType } from '@enums/schedule.status.enum';
import { ScheduleResponse } from '@domain/schedule/dto/response/schedule.response';

export interface ScheduleService {
  createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string>;
  updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void>;
  getSchedule(schedule_id: number): Promise<ScheduleResponse>;
  getScheduleList(
    requester_id: number,
    meeting_id: string,
    status: ScheduleStatusEnumType[],
    options: OrderingOptionEnumType,
  ): Promise<ScheduleListResponse>;
  withdraw(requester_id: number, schedule_id: number): Promise<void>;
  delete(requester_id: number, schedule_id: number): Promise<void>;
}
