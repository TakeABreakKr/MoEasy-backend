import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ScheduleService } from '@service/schedule/service/schedule.service.interface';
import { ScheduleCreateRequest } from '@service/schedule/dto/request/schedule.create.request';
import { ScheduleUpdateRequest } from '@service/schedule/dto/request/schedule.update.request';
import { ScheduleListResponse } from '@service/schedule/dto/response/schedule.list.response';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { MeetingUtils } from '@utils/meeting.utils';
import { ErrorMessageType } from '@enums/error.message.enum';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleListDto } from '@service/schedule/dto/response/schedule.list.dto';
import { SortUtils } from '@utils/sort.utils';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { ScheduleStatusEnum, ScheduleStatusEnumType } from '@enums/schedule.status.enum';
import { Participant } from '@domain/schedule/entity/participant.entity';
import { ScheduleResponse } from '@service/schedule/dto/response/schedule.response';
import { AuthorityEnum } from '@enums/authority.enum';
import { ScheduleWithdrawRequest } from '@service/schedule/dto/request/schedule.withdraw.request';
import { ScheduleDeleteRequest } from '@service/schedule/dto/request/schedule.delete.request';
import { Transactional } from 'typeorm-transactional';
import { ScheduleListMeetingListDto } from '@service/schedule/dto/response/schedule.list.meeting.list.dto';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { ScheduleComponent } from '@domain/schedule/component/schedule.component.interface';
import { ParticipantComponent } from '@domain/schedule/component/participant.component.interface';

@Injectable()
export class ScheduleServiceImpl implements ScheduleService {
  constructor(
    @Inject('ScheduleComponent') private scheduleComponent: ScheduleComponent,
    @Inject('MemberComponent') private memberComponent: MemberComponent,
    @Inject('MeetingComponent') private meetingComponent: MeetingComponent,
    @Inject('ParticipantComponent') private participantComponent: ParticipantComponent,
    @Inject('AuthorityComponent') private authorityComponent: AuthorityComponent,
    @Inject('NotificationComponent') private notificationComponent: NotificationComponent,
  ) {}

  @Transactional()
  public async createSchedule(req: ScheduleCreateRequest, requester_id: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule = await this.scheduleComponent.create({
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
    await this.participantComponent.saveAll(participants);

    const content = schedule.name + ' 일정이 생성되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);

    return schedule.schedule_id.toString();
  }

  @Transactional()
  public async updateSchedule(req: ScheduleUpdateRequest, requester_id: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const schedule: Schedule | null = await this.scheduleComponent.findByScheduleId(req.schedule_id);
    if (!schedule) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    schedule.update(req);

    const currentParticipants: number[] = (await this.participantComponent.findByScheduleId(req.schedule_id)).map(
      (participant) => participant.users_id,
    );
    const participantsToDelete: number[] = currentParticipants.filter((participant) => {
      return !req.participants.includes(participant);
    });
    await this.participantComponent.deleteAll(participantsToDelete, req.schedule_id);

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
    await this.participantComponent.saveAll(participants);

    const content = schedule.name + ' 일정이 수정되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);

    await this.scheduleComponent.update(schedule);
  }

  public async getSchedule(scheduleId: number): Promise<ScheduleResponse> {
    const schedule: Schedule | null = await this.scheduleComponent.findByScheduleId(scheduleId);
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
      const participants = await this.participantComponent.findAllByUserId(requester_id);
      const scheduleIds: number[] = participants.map((participant) => participant.schedule_id);
      schedules = await this.scheduleComponent.findAllByScheduleIds(scheduleIds);
    } else {
      const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);

      schedules = await this.scheduleComponent.findByMeetingId(meetingId);
    }

    if (!schedules?.length) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_SCHEDULE);
    }

    const now = new Date();
    const filteredSchedules = schedules.filter((schedule) => {
      const inProgressCondition =
        status.includes(ScheduleStatusEnum.IN_PROGRESS) && schedule.startDate <= now && schedule.endDate >= now;
      if (inProgressCondition) return true;

      const upcomingCondition = status.includes(ScheduleStatusEnum.UPCOMING) && schedule.startDate > now;
      if (upcomingCondition) return true;

      return status.includes(ScheduleStatusEnum.COMPLETED) && schedule.endDate < now;
    });

    SortUtils.sort<Schedule>(filteredSchedules, options);
    const scheduleList: ScheduleListDto[] = filteredSchedules.map((schedule) => {
      return {
        ...schedule,
        meetingId: MeetingUtils.transformMeetingIdToString(schedule.meeting_id),
        address: schedule.address.toAddressDto(),
      };
    });

    const meetings = await this.memberComponent.findByUserId(requester_id);
    const meetingIds = meetings.map((meeting) => meeting.meeting_id);
    const meetingList = await this.meetingComponent.findByMeetingIds(meetingIds);
    const meetingListDtos: ScheduleListMeetingListDto[] = meetingList.map((meeting) => {
      return {
        name: meeting.name,
        thumbnail: meeting.thumbnail,
      };
    });

    return {
      scheduleList,
      meetings: meetingListDtos,
    };
  }

  @Transactional()
  public async withdraw(requester_id: number, req: ScheduleWithdrawRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    const requester = await this.memberComponent.findByUsersAndMeetingId(requester_id, meetingId);
    if (requester.authority === AuthorityEnum.OWNER) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }

    const participant: Participant | null = await this.participantComponent.findByUserIdAndScheduleId(
      requester_id,
      req.schedule_id,
    );
    if (!participant) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_PARTICIPANT);
    }

    await this.participantComponent.delete(requester_id, req.schedule_id);
  }

  @Transactional()
  public async delete(requester_id: number, req: ScheduleDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);
    await this.scheduleComponent.delete(req.schedule_id);
  }
}
