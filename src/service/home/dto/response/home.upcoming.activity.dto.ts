import { ApiProperty } from '@nestjs/swagger';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';

export class HomeUpcomingActivityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  thumbnailPath: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty()
  meetingName: string;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region?: RegionEnumType;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty({
    type: ActivityParticipantDto,
    isArray: true,
  })
  participants: ActivityParticipantDto[];
}
