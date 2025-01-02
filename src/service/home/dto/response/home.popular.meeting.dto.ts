import { ApiProperty } from '@nestjs/swagger';

export class HomePopularMeetingDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  isLikedYn?: boolean;
}
