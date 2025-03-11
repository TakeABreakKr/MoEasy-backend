import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryStatDao } from '@domain/category/dao/category.stat.dao.interface';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';
import { CategoryStat } from '@domain/category/entity/category.stat.entity';
import { EnumUtil } from '@utils/enum.util';

@Injectable()
export class CategoryStatDaoImpl implements CategoryStatDao {
  constructor(@InjectRepository(CategoryStat) private categoryStatRepository: Repository<CategoryStat>) {}

  async findByCategory(category: MeetingCategoryEnumType): Promise<CategoryStat> {
    return this.categoryStatRepository.findOneBy({
      category: EnumUtil.findEnumKeyFromValue<typeof MeetingCategoryEnum>(MeetingCategoryEnum, category),
    });
  }
}
