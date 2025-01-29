import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryStat } from '@domain/category/entity/category.stat.entity';
import { CategoryStatDaoImpl } from '@domain/category/dao/category.stat.dao';
import { CategoryStatComponentImpl } from '@domain/category/component/category.stat.component';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryStat])],
  providers: [
    { provide: 'CategoryStatDao', useClass: CategoryStatDaoImpl },
    { provide: 'CategoryStatComponent', useClass: CategoryStatComponentImpl },
  ],
  exports: ['CategoryStatComponent'],
})
export class CategoryModule {}
