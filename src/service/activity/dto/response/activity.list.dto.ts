import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';

export class ActivityListDto {
  @ApiProperty()
  meetingId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnailId: number;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty()
  isJoined: boolean;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region?: RegionEnumType;
}
