import { RegionActivityDto } from '@domain/region/dto/region.activity.dto';
import { CreateRegionDto } from '@domain/region/dto/create.region.dto';

export interface RegionComponent {
  getMostActivatedRegions(): Promise<RegionActivityDto[]>;
  save(regionCreateDtos: CreateRegionDto[]): Promise<void>;
}
