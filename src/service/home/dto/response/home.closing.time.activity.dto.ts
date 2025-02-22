import { ApiProperty } from '@nestjs/swagger';

export class HomeClosingTimeActivityDto {
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
}
