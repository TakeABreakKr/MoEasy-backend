import { Inject, Injectable } from '@nestjs/common';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { RegionActivityDto } from '@domain/region/dto/region.activity.dto';
import { RegionDao } from '@domain/region/dao/region.dao.interface';
import { RegionEnum } from '@enums/region.enum';
import { CreateRegionDto } from '@domain/region/dto/create.region.dto';
import { Region } from '@domain/region/entity/region.entity';

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

  async create(regionCreateDtos: CreateRegionDto[]): Promise<void> {
    const regionList: Region[] = regionCreateDtos.map((regionCreateDto) => {
      return Region.create(regionCreateDto.name, regionCreateDto.count);
    });
    await this.regionDao.save(regionList);
  }
}
