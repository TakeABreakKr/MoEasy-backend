import { ApiProperty } from '@nestjs/swagger';

export class HomeClosingTimeActivityDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  isOnlineYn: boolean;

  @ApiProperty()
  description: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  time: Date;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  isLiked?: boolean;
}
