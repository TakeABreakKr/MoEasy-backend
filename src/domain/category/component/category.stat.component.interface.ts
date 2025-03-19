import { MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export interface CategoryStatComponent {
  getOrder(category: MeetingCategoryEnumType): Promise<number>;
}
