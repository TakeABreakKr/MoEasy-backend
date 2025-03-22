import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@root/enums/region.enum';
import { ActivityMemberDto } from '@service/activity/dto/response/activity.member.dto';

export class ActivityResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  announcement: string;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region?: RegionEnumType;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty({
    type: ActivityMemberDto,
    isArray: true,
  })
  members: ActivityMemberDto[];
}
