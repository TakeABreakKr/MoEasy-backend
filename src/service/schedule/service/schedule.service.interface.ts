import { ScheduleCreateRequest } from '@service/schedule/dto/request/schedule.create.request';
import { ScheduleListResponse } from '@service/schedule/dto/response/schedule.list.response';
import { ScheduleUpdateRequest } from '@service/schedule/dto/request/schedule.update.request';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleStatusEnumType } from '@enums/schedule.status.enum';
import { ScheduleResponse } from '@service/schedule/dto/response/schedule.response';
import { ScheduleWithdrawRequest } from '@service/schedule/dto/request/schedule.withdraw.request';
import { ScheduleDeleteRequest } from '@service/schedule/dto/request/schedule.delete.request';

export interface ScheduleService {
  createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string>;
  updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void>;
  getSchedule(schedule_id: number): Promise<ScheduleResponse>;
  getScheduleList(
    requester_id: number,
    status: ScheduleStatusEnumType[],
    options: OrderingOptionEnumType,
    meetingId?: string,
  ): Promise<ScheduleListResponse>;
  withdraw(requester_id: number, req: ScheduleWithdrawRequest): Promise<void>;
  delete(requester_id: number, req: ScheduleDeleteRequest): Promise<void>;
}
