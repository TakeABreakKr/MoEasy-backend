export const OptionEnum = {
  LATEST: 'LATEST',
  NAME: 'NAME',
} as const;

export type OptionEnumType = (typeof OptionEnum)[keyof typeof OptionEnum];
