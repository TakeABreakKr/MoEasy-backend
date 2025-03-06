import { Inject, Injectable } from '@nestjs/common';
import { CategoryStatComponent } from '@domain/category/component/category.stat.component.interface';
import { CategoryStatDao } from '@domain/category/dao/category.stat.dao.interface';
import { MeetingCategoryEnumType } from '@enums/meeting.category.enum';

@Injectable()
export class CategoryStatComponentImpl implements CategoryStatComponent {
  constructor(@Inject('CategoryStatDao') private readonly categoryStatDao: CategoryStatDao) {}

  async getOrder(category: MeetingCategoryEnumType): Promise<number> {
    const categoryStat = await this.categoryStatDao.findByCategory(category);
    if (!categoryStat) {
      throw new Error(`CategoryStat이 존재하지 않습니다. category: ${category}`);
    }

    return categoryStat.order;
  }
}
