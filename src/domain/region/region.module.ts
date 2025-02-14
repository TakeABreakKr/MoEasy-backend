import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionDaoImpl } from '@domain/region/dao/region.dao';
import { RegionComponentImpl } from '@domain/region/component/region.component';
import { Region } from '@domain/region/entity/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  providers: [
    { provide: 'RegionDao', useClass: RegionDaoImpl },
    { provide: 'RegionComponent', useClass: RegionComponentImpl },
  ],
  exports: ['RegionComponent'],
})
export class RegionModule {}
