import { Module } from '@nestjs/common';
import { RegionCronController } from '@service/region/controller/region.cron.controller';
import { RegionServiceImpl } from '@service/region/service/region.service';
import { ActivityModule } from '@domain/activity/activity.module';
import { RegionModule } from '@domain/region/region.module';

@Module({
  imports: [ActivityModule, RegionModule],
  controllers: [RegionCronController],
  providers: [{ provide: 'RegionService', useClass: RegionServiceImpl }],
})
export class RegionServiceModule {}
