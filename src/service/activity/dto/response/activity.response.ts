import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@root/enums/region.enum';
import { ActivityMemberDto } from '@service/activity/dto/response/activity.member.dto';

export class ActivityResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  notice: string;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region?: RegionEnumType;

  @ApiProperty()
  thumbnailId: number;

  @ApiProperty({ type: [Number] })
  noticeImageIds: number[];

  @ApiProperty()
  participantLimit: number;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  onlineLink?: string;

  @ApiProperty()
  isJoined: boolean;

  @ApiProperty({
    type: ActivityMemberDto,
    isArray: true,
  })
  members: ActivityMemberDto[];
}
