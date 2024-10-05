import { OrderingOptionEnumType } from '@enums/ordering.option.enum';

interface Sortable {
  name: string;
  updatedAt: Date;
}

export class SortUtils {
  public static sort<T extends Sortable>(items: T[], options: OrderingOptionEnumType): T[] {
    switch (options) {
      case 'NAME':
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case 'LATEST':
        return items.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
      default:
        return items;
    }
  }
}
