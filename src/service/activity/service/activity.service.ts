import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ActivityService } from '@service/activity/service/activity.service.interface';
import { ActivityCreateRequest } from '@service/activity/dto/request/activity.create.request';
import { ActivityUpdateRequest } from '@service/activity/dto/request/activity.update.request';
import { ActivityListResponse } from '@service/activity/dto/response/activity.list.response';
import { Activity } from '@domain/activity/entity/activity.entity';
import { MeetingUtils } from '@utils/meeting.utils';
import { ErrorMessageType } from '@enums/error.message.enum';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ActivityListDto } from '@service/activity/dto/response/activity.list.dto';
import { SortUtils } from '@utils/sort.utils';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { ActivityStatusEnum, ActivityStatusEnumType } from '@enums/activity.status.enum';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ActivityResponse } from '@service/activity/dto/response/activity.response';
import { AuthorityEnum } from '@enums/authority.enum';
import { ActivityWithdrawRequest } from '@service/activity/dto/request/activity.withdraw.request';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';
import { Transactional } from 'typeorm-transactional';
import { ActivityListMeetingListDto } from '@service/activity/dto/response/activity.list.meeting.list.dto';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';

@Injectable()
export class ActivityServiceImpl implements ActivityService {
  constructor(
    @Inject('ActivityComponent') private activityComponent: ActivityComponent,
    @Inject('MemberComponent') private memberComponent: MemberComponent,
    @Inject('MeetingComponent') private meetingComponent: MeetingComponent,
    @Inject('ParticipantComponent') private participantComponent: ParticipantComponent,
    @Inject('AuthorityComponent') private authorityComponent: AuthorityComponent,
    @Inject('NotificationComponent') private notificationComponent: NotificationComponent,
  ) {}

  @Transactional()
  public async createActivity(req: ActivityCreateRequest, requester_id: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const activity: Activity = await this.activityComponent.create({
      ...req,
      address: req.address.toAddress(),
      meetingId: req.meeting_id,
      onlineYn: req.onlineYn,
    });

    const participants: Participant[] = req.participants.map((participant) => {
      return Participant.create({
        activity_id: activity.activity_id,
        users_id: participant,
      });
    });
    await this.participantComponent.saveAll(participants);

    const content = activity.name + ' 일정이 생성되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);

    return activity.activity_id.toString();
  }

  @Transactional()
  public async updateActivity(req: ActivityUpdateRequest, requester_id: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);

    const activity: Activity | null = await this.activityComponent.findByActivityId(req.activityId);
    if (!activity) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);
    }

    activity.update({
      ...req,
      address: req.address.toAddress(),
    });

    const currentParticipants: number[] = (await this.participantComponent.findByActivityId(req.activityId)).map(
      (participant) => participant.users_id,
    );
    const participantsToDelete: number[] = currentParticipants.filter((participant) => {
      return !req.participants.includes(participant);
    });
    await this.participantComponent.deleteAll(participantsToDelete, req.activityId);

    const participants: Participant[] = req.participants
      .filter((userId) => {
        return !currentParticipants.includes(userId);
      })
      .map((participant) => {
        return Participant.create({
          activity_id: activity.activity_id,
          users_id: participant,
        });
      });
    await this.participantComponent.saveAll(participants);

    const content = activity.name + ' 일정이 수정되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);

    await this.activityComponent.update(activity);
  }

  public async getActivity(activityId: number): Promise<ActivityResponse> {
    const activity: Activity | null = await this.activityComponent.findByActivityId(activityId);
    if (!activity) throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);
    return {
      name: activity.name,
      explanation: activity.explanation,
      startDate: activity.startDate,
      endDate: activity.endDate,
      announcement: activity.announcement,
      onlineYn: activity.onlineYn,
      address: activity.address.toAddressDto(),
    };
  }

  public async getActivityList(
    requester_id: number,
    status: ActivityStatusEnumType[],
    options: OrderingOptionEnumType,
    meeting_id?: string,
  ): Promise<ActivityListResponse> {
    let activities: Activity[] = [];

    if (!meeting_id) {
      const participants = await this.participantComponent.findAllByUserId(requester_id);
      const activityIds: number[] = participants.map((participant) => participant.activity_id);
      activities = await this.activityComponent.findAllByActivityIds(activityIds);
    } else {
      const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);

      activities = await this.activityComponent.findByMeetingId(meetingId);
    }

    if (!activities?.length) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);
    }

    const now = new Date();
    const filteredActivities = activities.filter((activity) => {
      const inProgressCondition =
        status.includes(ActivityStatusEnum.IN_PROGRESS) && activity.startDate <= now && activity.endDate >= now;
      if (inProgressCondition) return true;

      const upcomingCondition = status.includes(ActivityStatusEnum.UPCOMING) && activity.startDate > now;
      if (upcomingCondition) return true;

      return status.includes(ActivityStatusEnum.COMPLETED) && activity.endDate < now;
    });

    SortUtils.sort<Activity>(filteredActivities, options);
    const activityList: ActivityListDto[] = filteredActivities.map((activity) => {
      return {
        ...activity,
        meetingId: MeetingUtils.transformMeetingIdToString(activity.meeting_id),
        address: activity.address.toAddressDto(),
      };
    });

    const meetings = await this.memberComponent.findByUserId(requester_id);
    const meetingIds = meetings.map((meeting) => meeting.meeting_id);
    const meetingList = await this.meetingComponent.findByMeetingIds(meetingIds);
    const meetingListDtos: ActivityListMeetingListDto[] = meetingList.map((meeting) => {
      return {
        name: meeting.name,
        thumbnail: meeting.thumbnail,
      };
    });

    return {
      activityList,
      meetings: meetingListDtos,
    };
  }

  @Transactional()
  public async withdraw(requester_id: number, req: ActivityWithdrawRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meeting_id);
    const requester = await this.memberComponent.findByUsersAndMeetingId(requester_id, meetingId);
    if (requester.authority === AuthorityEnum.OWNER) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }

    const participant: Participant | null = await this.participantComponent.findByUserIdAndActivityId(
      requester_id,
      req.activityId,
    );
    if (!participant) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_PARTICIPANT);
    }

    await this.participantComponent.delete(requester_id, req.activityId);
  }

  @Transactional()
  public async delete(requester_id: number, req: ActivityDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requester_id, meetingId);
    await this.activityComponent.delete(req.activityId);
  }
}
