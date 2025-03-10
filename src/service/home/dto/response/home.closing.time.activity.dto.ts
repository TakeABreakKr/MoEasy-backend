import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';
import { HomeActivityParticipantDto } from '@service/home/dto/response/home.activity.participant.dto';

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
  thumbnail: string;

  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  region: RegionEnumType;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  participantCount: number;

  @ApiProperty()
  participantLimit: number;

  @ApiProperty({
    type: HomeActivityParticipantDto,
    isArray: true,
  })
  participants: HomeActivityParticipantDto[];
}
