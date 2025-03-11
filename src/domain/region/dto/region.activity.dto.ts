import { RegionEnumType } from '@enums/region.enum';

export interface RegionActivityDto {
  name: RegionEnumType;
  activityCount: number;
  order: number;
}
