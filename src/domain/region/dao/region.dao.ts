import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionDao } from '@domain/region/dao/region.dao.interface';
import { Region } from '@domain/region/entity/region.entity';

@Injectable()
export class RegionDaoImpl implements RegionDao {
  constructor(@InjectRepository(Region) private regionRepository: Repository<Region>) {}

  async getMostActivatedRegions(): Promise<Region[]> {
    return this.regionRepository.find({
      order: { count: 'DESC' },
      take: 5,
    });
  }

  async save(regionList: Region[]): Promise<void> {
    for (const region of regionList) {
      const savedRegion: Region | null = await this.regionRepository.findOneBy({ name: region.name });
      if (savedRegion) {
        region.id = savedRegion.id;
      }
    }

    await this.regionRepository.save(regionList);
  }

  async findByRegionNames(regionNames: string[]): Promise<Region[]> {
    return this.regionRepository.find({ where: { name: In(regionNames) } });
  }
}
