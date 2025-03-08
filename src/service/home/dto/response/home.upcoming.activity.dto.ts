import { ApiProperty } from '@nestjs/swagger';

export class HomeUpcomingActivityDto {
  @ApiProperty()
  id: number;

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
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  participantThumbnailUrls: string[];
}
