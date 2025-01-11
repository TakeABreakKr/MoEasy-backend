import { ApiProperty } from '@nestjs/swagger';

export class HomeMostActivatedRegionDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  activityCount: number;

  @ApiProperty()
  order: number;
}
