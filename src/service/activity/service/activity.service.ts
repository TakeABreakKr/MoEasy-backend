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
import { getRegionEnum, RegionEnumType } from '@root/enums/region.enum';

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
  public async createActivity(req: ActivityCreateRequest, requesterId: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requesterId, meetingId);

    const activity: Activity = await this.activityComponent.create({
      ...req,
      address: req.address.toAddress(),
      meetingId: req.meetingId,
      onlineYn: req.onlineYn,
    });

    const participants: Participant[] = req.participants.map((participant) => {
      return Participant.create({
        activityId: activity.id,
        userId: participant,
      });
    });
    await this.participantComponent.saveAll(participants);

    const content = activity.name + ' 일정이 생성되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.userId);
    await this.notificationComponent.addNotifications(content, userIdList);

    return activity.id.toString();
  }

  @Transactional()
  public async updateActivity(req: ActivityUpdateRequest, requesterId: number): Promise<void> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requesterId, meetingId);

    const activity: Activity | null = await this.activityComponent.findByActivityId(req.activityId);
    if (!activity) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);
    }

    activity.update({
      ...req,
      address: req.address.toAddress(),
    });

    const currentParticipants: number[] = (await this.participantComponent.findByActivityId(req.activityId)).map(
      (participant) => participant.userId,
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
          activityId: activity.id,
          userId: participant,
        });
      });
    await this.participantComponent.saveAll(participants);

    const content = activity.name + ' 일정이 수정되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.userId);
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
    requesterId: number,
    status: ActivityStatusEnumType[],
    options: OrderingOptionEnumType,
    _meetingId?: string,
  ): Promise<ActivityListResponse> {
    let activities: Activity[];

    if (!_meetingId) {
      const participants = await this.participantComponent.findAllByUserId(requesterId);
      const activityIds: number[] = participants.map((participant) => participant.activityId);
      activities = await this.activityComponent.findAllByActivityIds(activityIds);
    } else {
      const meetingId: number = MeetingUtils.transformMeetingIdToInteger(_meetingId);

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

    const activityList: ActivityListDto[] = await Promise.all(
      filteredActivities.map(async (activity) => {
        const baseInfo = {
          activityId: activity.id,
          name: activity.name,
          startDate: activity.startDate,
          onlineYn: activity.onlineYn,
          explanation: activity.explanation,
          onlineLink: activity.getOnlineLink(),
          participantCount: await this.participantComponent.getParticipantCount(activity.id),
          participantLimit: activity.participantLimit,
          meetingId: MeetingUtils.transformMeetingIdToString(activity.meetingId),
          daysUntilStart: await this.activityComponent.getDaysUntilStart(activity.startDate),
        };

        if (!activity.onlineYn) {
          const address = activity.address;
          const region: RegionEnumType = getRegionEnum(address.sido, address.sigungu);
          return {
            ...baseInfo,
            region,
          };
        }
      }),
    );

    const meetings = await this.memberComponent.findByUserId(requesterId);
    const meetingIds = meetings.map((meeting) => meeting.meetingId);
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
  public async withdraw(requesterId: number, req: ActivityWithdrawRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    const requester = await this.memberComponent.findByUsersAndMeetingId(requesterId, meetingId);
    if (requester.authority === AuthorityEnum.OWNER) {
      throw new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS);
    }

    const participant: Participant | null = await this.participantComponent.findByUserIdAndActivityId(
      requesterId,
      req.activityId,
    );
    if (!participant) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_PARTICIPANT);
    }

    await this.participantComponent.delete(requesterId, req.activityId);
  }

  @Transactional()
  public async delete(requesterId: number, req: ActivityDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);

    await this.authorityComponent.validateAuthority(requesterId, meetingId);
    await this.activityComponent.delete(req.activityId);
  }
}
