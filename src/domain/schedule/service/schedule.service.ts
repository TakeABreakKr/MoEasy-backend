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
  constructor(
    private scheduleDao: ScheduleDao,
    private memberDao: MemberDao,
  ) {}

  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.validateAuthority(requester_id, meetingId);

    const schedule: Schedule = await this.scheduleDao.create({
      name: req.name,
      meetingId: req.meeting_id,
      explanation: req.explanation,
      startDate: req.startDate,
      endDate: req.endDate,
      reminder: req.reminder,
      announcement: req.announcement,
      online: req.online,
      address: req.addressDTO,
      detailAddress: req.detailAddress,
    });

    // TODO: 알림 추가

    return schedule.schedule_id.toString();
  }

  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.validateAuthority(requester_id, meetingId);

    const schedule: Schedule | null = await this.scheduleDao.findById(req.schedule_id);
    if (!schedule) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    schedule.update({
      name: req.name,
      explanation: req.explanation,
      startDate: req.startDate,
      endDate: req.endDate,
      reminder: req.reminder,
      announcement: req.announcement,
      online: req.online,
      address: req.addressDto,
      detailAddress: req.detailAddress,
    });

    await this.scheduleDao.update(schedule);
  }

  public async getScheduleList(meeting_id: string, requester_id: number): Promise<ScheduleListResponse> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    await this.validateAuthority(requester_id, meetingId);

    const schedule: Schedule[] = await this.scheduleDao.findByMeetingId(meetingId);
    if (!schedule?.length) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    return null;
  }

  private async validateAuthority(requester_id: number, meetingId: number) {
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member || !MANAGING_AUTHORITIES.includes(member.authority)) {
      throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
  }
}
