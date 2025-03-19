import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@root/enums/region.enum';

export class ActivityListDto {
  @ApiProperty()
  meetingId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  daysUntilStart: number;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region?: RegionEnumType;
}
