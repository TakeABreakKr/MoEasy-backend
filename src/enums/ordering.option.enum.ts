export const OrderingOptionEnum = {
  LATEST: 'LATEST',
  NAME: 'NAME',
} as const;

export type OrderingOptionEnumType = (typeof OrderingOptionEnum)[keyof typeof OrderingOptionEnum];
