import { RegionEnumType } from '@enums/region.enum';

export interface CreateRegionDto {
  name: RegionEnumType;
  count: number;
}
