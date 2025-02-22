import { ApiProperty } from '@nestjs/swagger';

export class HomeNewMeetingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  isLikedYn: boolean = false;
}
