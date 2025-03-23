import { Inject, Injectable } from '@nestjs/common';
import { RegionService } from '@service/region/service/region.service.interface';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { RegionEnum } from '@enums/region.enum';
import { CreateRegionDto } from '@domain/region/dto/create.region.dto';

@Injectable()
export class RegionServiceImpl implements RegionService {
  constructor(
    @Inject('RegionComponent') private regionComponent: RegionComponent,
    @Inject('ActivityComponent') private activityComponent: ActivityComponent,
  ) {}

  async regionStatisticsJob(): Promise<void> {
    const regionCreateDtos: CreateRegionDto[] = [];
    for (const region of Object.values(RegionEnum)) {
      const regionCount: number = await this.activityComponent.countRegions(region);
      regionCreateDtos.push({
        name: region,
        count: regionCount,
      });
    }

    await this.regionComponent.create(regionCreateDtos);
  }
}
