import { ApiProperty } from '@nestjs/swagger';
import { HomeCategoryGroupDto } from './home.category.group.dto';
import { HomePopularMeetingDto } from './home.popular.meeting.dto';
import { HomeNewMeetingDto } from './home.new.meeting.dto';
import { HomeClosingTimeActivityDto } from './home.closing.time.activity.dto';
import { HomeUpcomingActivityDto } from './home.upcoming.activity.dto';
import { HomeMostActivatedRegionDto } from './home.most.activated.region.dto';

export class HomeResponse {
  @ApiProperty({ type: HomeCategoryGroupDto, isArray: true })
  categories: HomeCategoryGroupDto[];

  @ApiProperty({ type: HomePopularMeetingDto, isArray: true })
  popularMeetings: HomePopularMeetingDto[];

  @ApiProperty({ type: HomeNewMeetingDto, isArray: true })
  newMeetings: HomeNewMeetingDto[];

  @ApiProperty({ type: HomeClosingTimeActivityDto, isArray: true })
  closingTimeActivities: HomeClosingTimeActivityDto[];

  @ApiProperty({ type: HomeUpcomingActivityDto, isArray: true })
  upcomingActivities?: HomeUpcomingActivityDto[];

  @ApiProperty({ type: HomeMostActivatedRegionDto, isArray: true })
  mostActivatedRegions: HomeMostActivatedRegionDto[];
}
