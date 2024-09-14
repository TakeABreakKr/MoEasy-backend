import { Injectable } from '@nestjs/common';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleCreateRequest } from '../dto/request/schedule.create.request';
import { ScheduleUpdateRequest } from '../dto/request/schedule.update.request';
import { ScheduleListResponse } from '../dto/response/schedule.list.response';

@Injectable()
export class ScheduleServiceImpl implements ScheduleService {
  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async getScheduleList(meeting_id: string, requester_id: number): Promise<ScheduleListResponse> {
    throw new Error('Method not implemented.');
  }
}
