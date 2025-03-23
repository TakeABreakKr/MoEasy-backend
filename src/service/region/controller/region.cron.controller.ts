import { Controller, Get, Inject, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RegionService } from '@service/region/service/region.service.interface';

@Controller('region')
export class RegionCronController {
  private readonly logger = new Logger(RegionCronController.name);

  constructor(@Inject('RegionService') private regionService: RegionService) {}

  @Get('statistics')
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async regionStatisticsJob() {
    this.logger.log('regionStatisticsJob Called');
    await this.regionService.regionStatisticsJob();
  }
}
