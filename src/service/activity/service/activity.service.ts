import { BadRequestException, ConflictException, Inject, Injectable } from '@nestjs/common';
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
import { ActivityParticipantRequest } from '@service/activity/dto/request/activity.participant.request';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';
import { Transactional } from 'typeorm-transactional';
import { ActivityListMeetingListDto } from '@service/activity/dto/response/activity.list.meeting.list.dto';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';
import { getRegionEnum, RegionEnumType } from '@enums/region.enum';
import { Users } from '@domain/user/entity/users.entity';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { ActivityMemberDto } from '@service/activity/dto/response/activity.member.dto';
import { Member } from '@domain/member/entity/member.entity';
import { FileService } from '@root/file/service/file.service';
import { ActivityNoticeImageComponent } from '@domain/activity/component/activity.notice.image.component.interface';

@Injectable()
export class ActivityServiceImpl implements ActivityService {
  constructor(
    @Inject('ActivityComponent') private activityComponent: ActivityComponent,
    @Inject('MemberComponent') private memberComponent: MemberComponent,
    @Inject('MeetingComponent') private meetingComponent: MeetingComponent,
    @Inject('ParticipantComponent') private participantComponent: ParticipantComponent,
    @Inject('AuthorityComponent') private authorityComponent: AuthorityComponent,
    @Inject('NotificationComponent') private notificationComponent: NotificationComponent,
    @Inject('UsersComponent') private usersComponent: UsersComponent,
    @Inject('FileService') private fileService: FileService,
    @Inject('ActivityNoticeImageComponent') private activityNoticeImageComponent: ActivityNoticeImageComponent,
  ) {}

  @Transactional()
  public async createActivity(req: ActivityCreateRequest, requesterId: number): Promise<string> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(req.meetingId);
    await this.authorityComponent.validateAuthority(requesterId, meetingId);

    const thumbnailId = await this.fileService.uploadAttachment(req.thumbnail);

    const activity: Activity = await this.activityComponent.create({
      name: req.name,
      thumbnailId: thumbnailId,
      startDate: req.startDate,
      endDate: req.endDate,
      reminder: req.reminder,
      notice: req?.notice,
      participantLimit: req.participantLimit,
      onlineLink: req?.onlineLink,
      address: req.address?.toAddress(),
      detailAddress: req?.detailAddress,
      meetingId: req.meetingId,
      onlineYn: req.onlineYn,
    });

    await this.processActivityNoticeImages(activity.id, req.noticeImages);

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

    const thumbnailId = await this.fileService.uploadAttachment(req.thumbnail);

    activity.update({
      name: req.name,
      thumbnailId: thumbnailId,
      startDate: req.startDate,
      endDate: req.endDate,
      reminder: req.reminder,
      notice: req?.notice,
      participantLimit: req.participantLimit,
      onlineLink: req?.onlineLink,
      address: req.address?.toAddress(),
      detailAddress: req?.detailAddress,
      onlineYn: req.onlineYn,
    });

    await this.processActivityNoticeImages(activity.id, req.noticeImages);

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

  private async processActivityNoticeImages(activityId: number, noticeImages?: Express.Multer.File[]): Promise<void> {
    if (!noticeImages?.length) return;

    for (const image of noticeImages.slice(0, 3)) {
      try {
        const attachmentId = await this.fileService.uploadAttachment(image);
        await this.activityNoticeImageComponent.create(activityId, attachmentId);
      } catch (error) {
        throw new BadRequestException(ErrorMessageType.ACTIVITY_NOTICE_IMAGE_UPLOAD_FAILED);
      }
    }
  }

  public async getActivity(activityId: number, requesterId: number): Promise<ActivityResponse> {
    const activity: Activity | null = await this.activityComponent.findByActivityId(activityId);
    if (!activity) throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);

    const participants: Participant[] = await this.participantComponent.findByActivityId(activity.id);
    const userIds = participants.map((participant) => participant.userId);
    const users: Users[] = await this.usersComponent.findByIds(userIds);
    const userMap = new Map<number, Users>();
    users.forEach((user) => {
      userMap.set(user.id, user);
    });

    const members: Member[] = await this.memberComponent.findByUserIdsAndMeetingId(userIds, activity.meetingId);
    const memberMap = new Map<number, Member>();
    members.forEach((member) => {
      memberMap.set(member.userId, member);
    });

    const memberDtos: ActivityMemberDto[] = participants.map((participant): ActivityMemberDto => {
      const user: Users = userMap.get(participant.userId);
      const member: Member = memberMap.get(participant.userId);

      return {
        username: user.username,
        authority: member.authority,
      };
    });

    const noticeImages = await this.activityNoticeImageComponent.findByActivityId(activity.id);
    const noticeImageIds = noticeImages.length > 0 ? noticeImages.map((image) => image.attachmentId) : [];

    const baseInfo = {
      activityId: activity.id,
      name: activity.name,
      thumbnailId: activity.thumbnailId,
      startDate: activity.startDate,
      onlineYn: activity.onlineYn,
      onlineLink: activity.getOnlineLink(),
      participantCount: await this.participantComponent.getParticipantCount(activity.id),
      participantLimit: activity.participantLimit,
      notice: activity.notice,
      members: memberDtos,
      isJoined: await this.participantComponent.existsParticipant(requesterId, activity.id),
      noticeImageIds: noticeImageIds,
    };

    if (!activity.onlineYn) {
      const address = activity.address;
      const region: RegionEnumType = getRegionEnum(address.sido, address.sigungu);
      return {
        ...baseInfo,
        region,
      };
    }

    return baseInfo;
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
          thumbnailId: activity.thumbnailId,
          startDate: activity.startDate,
          onlineYn: activity.onlineYn,
          onlineLink: activity.getOnlineLink(),
          participantCount: await this.participantComponent.getParticipantCount(activity.id),
          participantLimit: activity.participantLimit,
          isJoined: await this.participantComponent.existsParticipant(requesterId, activity.id),
          meetingId: MeetingUtils.transformMeetingIdToString(activity.meetingId),
        };

        if (!activity.onlineYn) {
          const address = activity.address;
          const region: RegionEnumType = getRegionEnum(address.sido, address.sigungu);
          return {
            ...baseInfo,
            region,
          };
        }

        return baseInfo;
      }),
    );

    const meetings = await this.memberComponent.findByUserId(requesterId);
    const meetingIds = meetings.map((meeting) => meeting.meetingId);
    const meetingList = await this.meetingComponent.findByMeetingIds(meetingIds);
    const meetingListDtos: ActivityListMeetingListDto[] = meetingList.map((meeting) => {
      return {
        name: meeting.name,
        thumbnailId: meeting.thumbnailId,
      };
    });

    return {
      activityList,
      meetings: meetingListDtos,
    };
  }

  @Transactional()
  public async joinActivity(requester: number, req: ActivityParticipantRequest): Promise<void> {
    const activity = await this.activityComponent.findByActivityId(req.activityId);
    if (!activity) throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);

    try {
      const participantCount = await this.participantComponent.getParticipantCount(req.activityId);
      if (participantCount >= activity.participantLimit) {
        throw new BadRequestException(ErrorMessageType.PARTICIPANT_LIMIT_EXCEEDED);
      }

      await this.participantComponent.create(req.activityId, requester);
    } catch (error) {
      if (error.message?.toLowerCase().includes('lock')) {
        throw new ConflictException(ErrorMessageType.JOIN_CONCURRENT_ERROR);
      }
      throw new ConflictException(ErrorMessageType.JOIN_OPERATION_ERROR);
    }
  }

  @Transactional()
  public async cancelActivity(requesterId: number, req: ActivityParticipantRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);

    await this.authorityComponent.validateAuthority(requesterId, meetingId);

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
  public async deleteActivity(requesterId: number, req: ActivityDeleteRequest): Promise<void> {
    const meetingId = MeetingUtils.transformMeetingIdToInteger(req.meetingId);

    const activity: Activity | null = await this.activityComponent.findByActivityId(req.activityId);
    if (!activity) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_ACTIVITY);
    }

    await this.authorityComponent.validateAuthority(requesterId, meetingId);
    await this.activityComponent.delete(req.activityId);

    const participants: Participant[] = await this.participantComponent.findByActivityId(req.activityId);
    if (!participants.length) {
      return;
    }

    const content = activity.name + ' 일정이 삭제되었습니다.';
    const userIdList: number[] = participants.map((participant) => participant.userId);
    await this.notificationComponent.addNotifications(content, userIdList);
  }
}
