import { RegionActivityDto } from '@domain/region/dto/region.activity.dto';

export interface RegionComponent {
  getMostActivatedRegions(): Promise<RegionActivityDto[]>;
}
