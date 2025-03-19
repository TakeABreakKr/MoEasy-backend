import { ApiProperty } from '@nestjs/swagger';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';

export class HomeMostActivatedRegionDto {
  @ApiProperty({
    enum: RegionEnum,
    example: RegionEnum.SEOCHO,
  })
  name: RegionEnumType;

  @ApiProperty()
  activityCount: number;

  @ApiProperty()
  order: number;
}
