export const AuthorityEnum = {
  WAITING: 'WAITING',
  MEMBER: 'MEMBER',
  MANAGER: 'MANAGER',
  OWNER: 'OWNER',
} as const;

export type AuthorityEnumType = (typeof AuthorityEnum)[keyof typeof AuthorityEnum];

export const MANAGING_AUTHORITIES: AuthorityEnumType[] = [AuthorityEnum.OWNER, AuthorityEnum.MANAGER];
