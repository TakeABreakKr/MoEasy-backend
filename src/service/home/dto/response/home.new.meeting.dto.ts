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
  thumbnailId: number;

  @ApiProperty()
  likedYn: boolean = false;
}
