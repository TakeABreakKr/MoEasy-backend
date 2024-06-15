export const envEnum = {
  DEV: 'DEV',
  PROD: 'PROD',
} as const;

export type envEnumType = (typeof envEnum)[keyof typeof envEnum];
