import { ApiProperty } from '@nestjs/swagger';

export class HomeNewMeetingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  isLikedYn: boolean = false;
}
