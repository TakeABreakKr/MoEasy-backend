import { ApiProperty } from '@nestjs/swagger';

export class HomeUpcomingActivityDto {
  @ApiProperty()
  activityName: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  meetingName: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  memberCount: number;
}
