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
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleListDto } from '@domain/schedule/dto/response/schedule.list.dto';
import { SortUtils } from '@utils/sort.utils';

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
      ...req,
      meetingId: req.meeting_id,
      onlineYn: req.onlineYn,
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
      ...req,
      onlineYn: req.onlineYn,
      address: req.addressDto,
    });

    // TODO: 알림 추가

    await this.scheduleDao.update(schedule);
  }

  public async getScheduleList(
    meeting_id: string,
    requester_id: number,
    options?: OrderingOptionEnumType,
  ): Promise<ScheduleListResponse> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    await this.validateAuthority(requester_id, meetingId);

    const schedules: Schedule[] = await this.scheduleDao.findByMeetingId(meetingId);
    if (!schedules?.length) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    SortUtils.sort<Schedule>(schedules, options);
    const scheduleList: ScheduleListDto[] = schedules.map((schedule) => {
      return {
        ...schedule,
        meetingId: MeetingUtils.transformMeetingIdToString(meetingId),
        address: schedule.address.toAddressDto(),
      };
    });

    return {
      scheduleList,
    };
  }

  private async validateAuthority(requester_id: number, meetingId: number) {
    const member: Member | null = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (!member || !MANAGING_AUTHORITIES.includes(member.authority)) {
      throw new BadRequestException(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
  }
}
