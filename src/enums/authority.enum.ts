export const AuthorityEnum = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
} as const;

export type AuthorityEnumType = (typeof AuthorityEnum)[keyof typeof AuthorityEnum];
