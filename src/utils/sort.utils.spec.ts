import { SortUtils } from './sort.utils';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { Sortable } from './sort.sortable';

const date1 = new Date('2025-01-03');
const date2 = new Date('2025-01-15');
const date3 = new Date('2025-01-25');

const testItems: Sortable[] = [
  { name: '도연', updatedAt: date3 },
  { name: '한결', updatedAt: date1 },
  { name: '성용', updatedAt: date2 },
];

describe('SortUtilsTest', () => {
  it('SortUtilsTest - NAME', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.NAME);
    expect(result).toEqual([
      { name: '도연', updatedAt: date3 },
      { name: '성용', updatedAt: date2 },
      { name: '한결', updatedAt: date1 },
    ]);
  });

  it('SortUtilsTest - LATEST', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.LATEST);

    expect(result).toEqual([
      { name: '도연', updatedAt: date3 },
      { name: '성용', updatedAt: date2 },
      { name: '한결', updatedAt: date1 },
    ]);
  });

  it('SortUtilsTest - OLDEST', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.OLDEST);

    expect(result).toEqual([
      { name: '한결', updatedAt: date1 },
      { name: '성용', updatedAt: date2 },
      { name: '도연', updatedAt: date3 },
    ]);
  });
});
