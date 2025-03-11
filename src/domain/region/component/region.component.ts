import { Inject, Injectable } from '@nestjs/common';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { RegionActivityDto } from '@domain/region/dto/region.activity.dto';
import { RegionDao } from '@domain/region/dao/region.dao.interface';
import { RegionEnum } from '@enums/region.enum';

@Injectable()
export class RegionComponentImpl implements RegionComponent {
  constructor(@Inject('RegionDao') private regionDao: RegionDao) {}

  async getMostActivatedRegions(): Promise<RegionActivityDto[]> {
    const mostActivatedRegions = await this.regionDao.getMostActivatedRegions();
    return mostActivatedRegions
      .sort((a, b) => a.count - b.count)
      .map((region, index) => {
        return {
          order: index,
          name: RegionEnum[region.name],
          activityCount: region.count,
        };
      });
  }
}
