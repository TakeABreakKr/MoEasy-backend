import { ApiProperty } from '@nestjs/swagger';
import { HomeCategoryGroupDto } from '@service/home/dto/response/home.category.group.dto';
import { HomeMostActivatedRegionDto } from '@service/home/dto/response/home.most.activated.region.dto';

export class HomeCachedResponse {
  @ApiProperty({ type: HomeCategoryGroupDto, isArray: true })
  categories: HomeCategoryGroupDto[];

  @ApiProperty({ type: HomeMostActivatedRegionDto, isArray: true })
  mostActivatedRegions: HomeMostActivatedRegionDto[];
}
