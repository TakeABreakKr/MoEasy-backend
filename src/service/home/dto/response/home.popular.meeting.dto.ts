import { ApiProperty } from '@nestjs/swagger';

export class HomePopularMeetingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  likedYn?: boolean;
}
