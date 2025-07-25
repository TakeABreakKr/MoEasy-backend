import { ApiProperty } from '@nestjs/swagger';
import { HomeNewMeetingDto } from './home.new.meeting.dto';
import { HomeClosingTimeActivityDto } from './home.closing.time.activity.dto';
import { HomeUpcomingActivityDto } from './home.upcoming.activity.dto';
import { HomePopularMeetingDto } from '@service/home/dto/response/home.popular.meeting.dto';

export class HomeResponse {
  @ApiProperty({ type: HomeNewMeetingDto, isArray: true })
  newMeetings: HomeNewMeetingDto[];

  @ApiProperty({ type: HomeClosingTimeActivityDto, isArray: true })
  closingTimeActivities: HomeClosingTimeActivityDto[];

  @ApiProperty({ type: HomeUpcomingActivityDto, isArray: true })
  upcomingActivities?: HomeUpcomingActivityDto[];

  @ApiProperty({ type: HomePopularMeetingDto, isArray: true })
  popularMeetings: HomePopularMeetingDto[];
}
