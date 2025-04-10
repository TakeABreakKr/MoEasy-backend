import { ApiProperty } from '@nestjs/swagger';

export class HomePopularMeetingDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnailId: number;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  likedYn?: boolean;
}
