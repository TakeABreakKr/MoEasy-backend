import { BadRequestException, Injectable } from '@nestjs/common';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleCreateRequest } from '../dto/request/schedule.create.request';
import { ScheduleUpdateRequest } from '../dto/request/schedule.update.request';
import { ScheduleListResponse } from '../dto/response/schedule.list.response';
import { ScheduleDao } from '@domain/schedule/dao/schedule.dao';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { MeetingUtils } from '@utils/meeting.utils';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { ErrorMessageType } from '@enums/error.message.enum';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleListDto } from '@domain/schedule/dto/response/schedule.list.dto';
import { SortUtils } from '@utils/sort.utils';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { AuthorityComponent } from '@domain/user/component/authority.component';

@Injectable()
export class ScheduleServiceImpl implements ScheduleService {
  constructor(
    private scheduleDao: ScheduleDao,
    private memberDao: MemberDao,
    private readonly authorityComponent: AuthorityComponent,
    private readonly notificationComponent: NotificationComponent,
  ) {}

  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule = await this.scheduleDao.create({
      ...req,
      meetingId: req.meeting_id,
      onlineYn: req.onlineYn,
    });

    const content = schedule.name + ' 일정이 생성되었습니다.';
    const members = await this.memberDao.findByMeetingId(meetingId);
    members.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));

    return schedule.schedule_id.toString();
  }

  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule | null = await this.scheduleDao.findById(req.schedule_id);
    if (!schedule) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    schedule.update({
      ...req,
      onlineYn: req.onlineYn,
      address: req.address,
    });

    const content = schedule.name + ' 일정이 수정되었습니다.';
    const members = await this.memberDao.findByMeetingId(meetingId);
    members.forEach((member: Member) => this.notificationComponent.addNotification(content, member.users_id));

    await this.scheduleDao.update(schedule);
  }

  public async getScheduleList(
    meeting_id: string,
    requester_id: number,
    options?: OrderingOptionEnumType,
  ): Promise<ScheduleListResponse> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

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
}
