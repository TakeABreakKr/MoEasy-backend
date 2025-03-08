import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';

export class HomeClosingTimeActivityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  meetingName: string;

  @ApiProperty({
    type: Object.keys(RegionEnum),
    example: RegionEnum.SEOCHO,
  })
  region: RegionEnumType;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  participantThumbnailUrls: string[];
}
