import { Inject, Injectable } from '@nestjs/common';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { RegionActivityDto } from '@domain/region/dto/region.activity.dto';
import { RegionDao } from '@domain/region/dao/region.dao.interface';
import { RegionEnum } from '@enums/region.enum';
import { CreateRegionDto } from '@domain/region/dto/create.region.dto';
import { Region } from '@domain/region/entity/region.entity';
import { EnumUtil } from '@utils/enum.util';

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

  async save(regionCreateDtos: CreateRegionDto[]): Promise<void> {
    if (!regionCreateDtos?.length) {
      return;
    }

    const regionNames: string[] = regionCreateDtos.map((regionCreateDto) =>
      EnumUtil.findEnumKeyFromValue<typeof RegionEnum>(RegionEnum, regionCreateDto.name),
    );
    const regions = await this.regionDao.findByRegionNames(regionNames);
    const regionMap: Map<string, Region> = new Map(regions.map((region) => [region.name, region]));

    for (const regionCreateDto of regionCreateDtos) {
      const name = regionCreateDto.name;
      let region = regionMap.get(name);
      if (!region) {
        region = Region.create(name);
      }

      region.setCount(regionCreateDto.count);
      regionMap.set(name, region);
    }

    await this.regionDao.save(Array.from(regionMap.values()));
  }
}
