import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
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
}
