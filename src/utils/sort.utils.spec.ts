import { SortUtils } from '@utils/sort.utils';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { Sortable } from '@utils/sort.sortable';

const oldesDate = new Date('2025-01-03');
const middleDate = new Date('2025-01-15');
const latestDate = new Date('2025-01-25');

const testItems: Sortable[] = [
  { name: '도연', updatedAt: latestDate },
  { name: '한결', updatedAt: oldesDate },
  { name: '성용', updatedAt: middleDate },
];

describe('SortUtilsTest', () => {
  it('SortUtilsTest - NAME', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.NAME);

    expect(result).toEqual([
      { name: '도연', updatedAt: latestDate },
      { name: '성용', updatedAt: middleDate },
      { name: '한결', updatedAt: oldesDate },
    ]);
  });

  it('SortUtilsTest - LATEST', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.LATEST);

    expect(result).toEqual([
      { name: '도연', updatedAt: latestDate },
      { name: '성용', updatedAt: middleDate },
      { name: '한결', updatedAt: oldesDate },
    ]);
  });

  it('SortUtilsTest - OLDEST', async () => {
    const result = SortUtils.sort(testItems, OrderingOptionEnum.OLDEST);

    expect(result).toEqual([
      { name: '한결', updatedAt: oldesDate },
      { name: '성용', updatedAt: middleDate },
      { name: '도연', updatedAt: latestDate },
    ]);
  });

  it('SortUtilsTest - SAME NAME', async () => {
    const sameNameItems: Sortable[] = [
      { name: '도연', updatedAt: latestDate },
      { name: '도연', updatedAt: middleDate },
      { name: '도연', updatedAt: oldesDate },
    ];
    const result = SortUtils.sort(sameNameItems, OrderingOptionEnum.NAME);

    expect(result).toEqual([
      { name: '도연', updatedAt: latestDate },
      { name: '도연', updatedAt: middleDate },
      { name: '도연', updatedAt: oldesDate },
    ]);
  });

  it('SortUtilsTest - EAPTY ARRAY', async () => {
    const emptyArray: Sortable[] = [];

    const nameResult = SortUtils.sort(emptyArray, OrderingOptionEnum.NAME);
    expect(nameResult).toEqual([]);

    const latestResult = SortUtils.sort(emptyArray, OrderingOptionEnum.LATEST);
    expect(latestResult).toEqual([]);

    const oldestResult = SortUtils.sort(emptyArray, OrderingOptionEnum.OLDEST);
    expect(oldestResult).toEqual([]);
  });
});
