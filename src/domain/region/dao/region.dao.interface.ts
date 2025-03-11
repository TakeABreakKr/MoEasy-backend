import { Region } from '@domain/region/entity/region.entity';

export interface RegionDao {
  getMostActivatedRegions(): Promise<Region[]>;
}
