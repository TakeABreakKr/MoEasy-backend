import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { RegionService } from '@service/region/service/region.service.interface';
import { RegionComponent } from '@domain/region/component/region.component.interface';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { RegionEnum } from '@enums/region.enum';
import { CreateRegionDto } from '@domain/region/dto/create.region.dto';

@Injectable()
export class RegionServiceImpl implements RegionService {
  private readonly logger = new Logger(RegionServiceImpl.name);

  constructor(
    @Inject('RegionComponent') private regionComponent: RegionComponent,
    @Inject('ActivityComponent') private activityComponent: ActivityComponent,
  ) {}

  async regionStatisticsJob(): Promise<void> {
    try {
      const regionCreateDtos: CreateRegionDto[] = [];
      for (const region of Object.values(RegionEnum)) {
        const regionCount: number = await this.activityComponent.countRegions(region);
        this.logger.log(`Region: ${region}, Count: ${regionCount}`);
        regionCreateDtos.push({
          name: region,
          count: regionCount,
        });
      }

      await this.regionComponent.save(regionCreateDtos);
      this.logger.log('Region statistics job completed');
    } catch (error) {
      this.logger.error(`Region statistics job failed: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Region statistics job failed');
    }
  }
}
