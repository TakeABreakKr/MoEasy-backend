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

@Injectable()
export class HomeServiceImpl implements HomeService {
  constructor(
    @Inject() private categoryComponent: CategoryStatComponent,
    @Inject() private meetingComponent: MeetingComponent,
    @Inject() private memberComponent: MemberComponent,
  ) {}

  public async getHome(user: AuthUser): Promise<HomeResponse> {
    if (!user || !user.id) {
      return this.getLoggedOutHome();
    }

    return this.getLoggedInHome(user.id);
  }

  private async getLoggedOutHome(): Promise<HomeResponse> {
    return null;
  }

  private async getLoggedInHome(id: number): Promise<HomeResponse> {
    const popularMeetings = await this.getPopularMeetings(id);
    return {
      newMeetings: null,
      closingTimeActivities: null,
      upcomingActivities: null,
      popularMeetings,
    };
  }

  private async getPopularMeetings(id: number): Promise<HomePopularMeetingDto[]> {
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
          isLikedYn: false, // TODO: Implement this after Like system developed
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
        order: await this.categoryComponent.getOrder(category),
      };
    });
  }

  private async getMostActivatedRegions(): Promise<HomeMostActivatedRegionDto[]> {

  }
}
