export const RedisPrefixEnum = {} as const;

export type RedisPrefixEnumType = (typeof RedisPrefixEnum)[keyof typeof RedisPrefixEnum];
