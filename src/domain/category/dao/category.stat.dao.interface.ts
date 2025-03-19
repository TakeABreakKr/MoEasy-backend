import { CategoryStat } from '@domain/category/entity/category.stat.entity';
import { MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export interface CategoryStatDao {
  findByCategory(category: MeetingCategoryEnumType): Promise<CategoryStat>;
}
