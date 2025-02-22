import { Inject, Injectable } from '@nestjs/common';
import { HomeService } from '@service/home/service/home.service.interface';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { CategoryStatComponent } from '@domain/category/component/category.stat.component.interface';
import { getMeetingCategoryListInGroup, MeetingCategoryGroupEnum } from '@enums/meeting.category.group.enum';
import { MeetingCategoryEnumType } from '@enums/meeting.category.enum';
import { AuthUser } from '@decorator/token.decorator';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { HomeCachedResponse } from '@service/home/dto/response/home.cached.response';
import { HomeCategoryGroupDto } from '@service/home/dto/response/home.category.group.dto';
import { HomePopularMeetingDto } from '@service/home/dto/response/home.popular.meeting.dto';
import { HomeMostActivatedRegionDto } from '@service/home/dto/response/home.most.activated.region.dto';
import { MeetingUtils } from '@utils/meeting.utils';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { HomeNewMeetingDto } from '@service/home/dto/response/home.new.meeting.dto';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { HomeClosingTimeActivityDto } from '@service/home/dto/response/home.closing.time.activity.dto';
import { HomeUpcomingActivityDto } from '@service/home/dto/response/home.upcoming.activity.dto';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { getRegionEnum, RegionEnumType } from '@enums/region.enum';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';

@Injectable()
export class HomeServiceImpl implements HomeService {
  constructor(
    @Inject('CategoryStatComponent') private categoryStatComponent: CategoryStatComponent,
    @Inject('MeetingComponent') private meetingComponent: MeetingComponent,
    @Inject('MemberComponent') private memberComponent: MemberComponent,
    @Inject('ActivityComponent') private activityComponent: ActivityComponent,
    @Inject('ParticipantComponent') private participantComponent: ParticipantComponent,
    @Inject('RegionComponent') private regionComponent: RegionComponent,
  ) {}

  public async getHome(user: AuthUser): Promise<HomeResponse> {
    const userId: number = user?.id;
    const newMeetings = await this.getNewMeetings(userId);
    const closingTimeActivities: HomeClosingTimeActivityDto[] = await this.getClosingTimeActivities();
    const upcomingActivities: HomeUpcomingActivityDto[] = await this.getUpcomingActivities(userId);
    const popularMeetings = await this.getPopularMeetings(userId);
    return {
      newMeetings,
      closingTimeActivities,
      upcomingActivities,
      popularMeetings,
    };
  }

  private async getNewMeetings(id?: number): Promise<HomeNewMeetingDto[]> {
    const meetings: Meeting[] = await this.meetingComponent.getNewMeetings();
    return Promise.all(
      meetings.map(async (meeting) => {
        return {
          id: MeetingUtils.transformMeetingIdToString(meeting.meeting_id),
          name: meeting.name,
          description: meeting.explanation,
          memberCount: await this.memberComponent.getMemberCount(meeting.meeting_id),
          isLikedYn: id ? false : false, // TODO: Implement this after Like system developed
        };
      }),
    );
  }

  private async getClosingTimeActivities(): Promise<HomeClosingTimeActivityDto[]> {
    const activities = await this.activityComponent.getClosingTimeActivities();
    return Promise.all(
      activities.map(async (activity) => {
        const meeting: Meeting = await this.meetingComponent.findByMeetingId(activity.meeting_id);
        const address = activity.address;
        const region: RegionEnumType = getRegionEnum(address.sido, address.sigungu);
        return {
          id: activity.activity_id,
          activityName: activity.name,
          isOnlineYn: activity.onlineYn,
          meetingName: meeting.name,
          location: region.toString(),
          time: activity.startDate,
          participantCount: await this.participantComponent.getParticipantCount(activity.activity_id),
        };
      }),
    );
  }

  private async getUpcomingActivities(id?: number): Promise<HomeUpcomingActivityDto[]> {
    return [];
  }

  private async getPopularMeetings(id?: number): Promise<HomePopularMeetingDto[]> {
    const meetingIds: number[] = await this.memberComponent.getMostPopularMeetingIds();
    const popularMeetings = await this.meetingComponent.findByMeetingIds(meetingIds);
    return Promise.all(
      popularMeetings.map(async (meeting) => {
        return {
          id: MeetingUtils.transformMeetingIdToString(meeting.meeting_id),
          name: meeting.name,
          thumbnail: meeting.thumbnail,
          explanation: meeting.explanation,
          memberCount: await this.memberComponent.getMemberCount(meeting.meeting_id),
          isLikedYn: id ? false : false, // TODO: Implement this after Like system developed
        };
      }),
    );
  }

  public async getCachedHome(): Promise<HomeCachedResponse> {
    const categories = await this.getCategories();
    const mostActivatedRegions = await this.getMostActivatedRegions();
    return {
      categories,
      mostActivatedRegions,
    };
  }

  private async getCategories(): Promise<HomeCategoryGroupDto[]> {
    return Promise.all(
      Object.values(MeetingCategoryGroupEnum).map(async (group) => {
        const meetingCategoryListInGroup = getMeetingCategoryListInGroup(group);
        return {
          name: group,
          homeCategoryList: await Promise.all(this.getHomeCategoryDto(meetingCategoryListInGroup)),
        };
      }),
    );
  }

  private getHomeCategoryDto(meetingCategoryListInGroup: MeetingCategoryEnumType[]) {
    return meetingCategoryListInGroup.map(async (category) => {
      return {
        name: category,
        order: await this.categoryStatComponent.getOrder(category),
      };
    });
  }

  private async getMostActivatedRegions(): Promise<HomeMostActivatedRegionDto[]> {
    return this.regionComponent.getMostActivatedRegions();
  }
}
