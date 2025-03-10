import { ApiProperty } from '@nestjs/swagger';
import { HomeActivityParticipantDto } from '@service/home/dto/response/home.activity.participant.dto';

export class HomeUpcomingActivityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  activityName: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  meetingName: string;

  @ApiProperty()
  region: string;

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
