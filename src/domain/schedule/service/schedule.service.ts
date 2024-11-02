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
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { ScheduleStatusEnum, ScheduleStatusEnumType } from '@enums/schedule.status.enum';
import { Participant } from '@domain/schedule/entity/participant.entity';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao';
import { ScheduleResponse } from '@domain/schedule/dto/response/schedule.response';
import { AuthorityEnum } from '@enums/authority.enum';
import { ScheduleWithdrawRequest } from '@domain/schedule/dto/request/schedule.withdraw.request';
import { ScheduleDeleteRequest } from '@domain/schedule/dto/request/schedule.delete.request';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ScheduleServiceImpl implements ScheduleService {
  constructor(
    private scheduleDao: ScheduleDao,
    private memberDao: MemberDao,
    private participantDao: ParticipantDao,
    private authorityComponent: AuthorityComponent,
    private notificationComponent: NotificationComponent,
  ) {}

  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule = await this.scheduleDao.create({
      ...req,
      meetingId: req.meeting_id,
      onlineYn: req.onlineYn,
    });

    const participants: Participant[] = req.participants.map((participant) => {
      return Participant.create({
        schedule_id: schedule.schedule_id,
        users_id: participant,
      });
    });
    await this.participantDao.saveAll(participants);

    const content = schedule.name + ' 일정이 생성되었습니다.';
    await this.notificationComponent.addNotificationToParticipants(content, schedule.schedule_id);

    return schedule.schedule_id.toString();
  }

  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule | null = await this.scheduleDao.findByScheduleId(req.schedule_id);
    if (!schedule) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    schedule.update(req);

    const currentParticipants: number[] = (await this.participantDao.findByScheduleId(req.schedule_id)).map(
      (participant) => participant.users_id,
    );
    const participantsToDelete: number[] = currentParticipants.filter((participant) => {
      return !req.participants.includes(participant);
    });
    await this.participantDao.deleteAll(participantsToDelete, req.schedule_id);

    const participants: Participant[] = req.participants
      .filter((userId) => {
        return !currentParticipants.includes(userId);
      })
      .map((participant) => {
        return Participant.create({
          schedule_id: schedule.schedule_id,
          users_id: participant,
        });
      });
    await this.participantDao.saveAll(participants);

    const content = schedule.name + ' 일정이 수정되었습니다.';
    await this.notificationComponent.addNotificationToParticipants(content, schedule.schedule_id);

    await this.scheduleDao.update(schedule);
  }

  public async getSchedule(scheduleId: number): Promise<ScheduleResponse> {
    const schedule: Schedule | null = await this.scheduleDao.findByScheduleId(scheduleId);
    if (!schedule) throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    return {
      name: schedule.name,
      explanation: schedule.explanation,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      announcement: schedule.announcement,
      onlineYn: schedule.onlineYn,
      address: schedule.address.toAddressDto(),
    };
  }

  public async getScheduleList(
    requester_id: number,
    status: ScheduleStatusEnumType[],
    options: OrderingOptionEnumType,
    meeting_id?: string,
  ): Promise<ScheduleListResponse> {
    let schedules: Schedule[] = [];

    if (!meeting_id) {
      const participants = await this.participantDao.findAllByUserId(requester_id);
      const scheduleIds: number[] = participants.map((participant) => participant.schedule_id);
      schedules = await this.scheduleDao.findAllByScheduleIds(scheduleIds);
    } else {
      const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);

      schedules = await this.scheduleDao.findByMeetingId(meetingId);
    }

    if (!schedules?.length) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    const now = new Date();
    const filteredSchedules = schedules.filter((schedule) => {
      const inProgressCondition =
        status.includes(ScheduleStatusEnum.IN_PROGRESS) && schedule.startDate <= now && schedule.endDate >= now;
      const upcomingCondition = status.includes(ScheduleStatusEnum.UPCOMING) && schedule.startDate > now;
      const completedCondition = status.includes(ScheduleStatusEnum.COMPLETED) && schedule.endDate < now;
      return inProgressCondition || upcomingCondition || completedCondition;
    });

    SortUtils.sort<Schedule>(filteredSchedules, options);
    const scheduleList: ScheduleListDto[] = filteredSchedules.map((schedule) => {
      return {
        ...schedule,
        meetingId: MeetingUtils.transformMeetingIdToString(schedule.meeting_id),
        address: schedule.address.toAddressDto(),
      };
    });

    return {
      scheduleList,
    };
  }

  public async withdraw(requester_id: number, req: ScheduleWithdrawRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    const requester = await this.memberDao.findByUsersAndMeetingId(requester_id, meetingId);
    if (requester.authority === AuthorityEnum.OWNER) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }

    const participant: Participant | null = await this.participantDao.findByUserIdAndScheduleId(
      requester_id,
      req.schedule_id,
    );
    if (!participant) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_PARTICIPANT);
    } else {
      await this.participantDao.delete(requester_id, req.schedule_id);
    }
  }

  public async delete(requester_id: number, req: ScheduleDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);
    await this.scheduleDao.delete(req.schedule_id);
  }
}
