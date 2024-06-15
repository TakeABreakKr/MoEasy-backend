export const EnvEnum = {
  DEV: 'DEV',
  PROD: 'PROD',
} as const;

export type EnvEnumType = (typeof EnvEnum)[keyof typeof EnvEnum];
