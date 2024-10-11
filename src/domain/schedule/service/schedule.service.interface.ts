import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleStatusEnumType } from '@enums/schedule.status.enum';

export interface ScheduleService {
  createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string>;
  updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void>;
  getScheduleList(
    requester_id: number,
    meeting_id: string,
    status: ScheduleStatusEnumType[],
    options: OrderingOptionEnumType,
  ): Promise<ScheduleListResponse>;
}
