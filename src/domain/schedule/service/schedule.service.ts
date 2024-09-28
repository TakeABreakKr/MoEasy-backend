import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleCreateRequest } from '../dto/request/schedule.create.request';
import { ScheduleUpdateRequest } from '../dto/request/schedule.update.request';
import { ScheduleListResponse } from '../dto/response/schedule.list.response';
import { ScheduleDao } from '@domain/schedule/dao/schedule.dao';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { MeetingUtils } from '@utils/meeting.utils';
import { Member } from '@domain/meeting/entity/member.entity';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { MANAGING_AUTHORITIES } from '@enums/authority.enum';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export class ScheduleServiceImpl implements ScheduleService {
  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    throw new Error('Method not implemented.');
  }

  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private async validateAuthority(requester_id: number, meetingId: number) {
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member || !MANAGING_AUTHORITIES.includes(member.authority)) {
      throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
  }
}
