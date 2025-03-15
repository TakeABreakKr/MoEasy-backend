import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

export class HomeClosingTimeActivityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty()
  meetingName: string;

  @ApiProperty()
  thumbnail: string;

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
