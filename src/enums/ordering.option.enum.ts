export const OrderingOptionEnum = {
  LATEST: 'LATEST',
  NAME: 'NAME',
  OLDEST: 'OLDEST',
} as const;

export type OrderingOptionEnumType = (typeof OrderingOptionEnum)[keyof typeof OrderingOptionEnum];
