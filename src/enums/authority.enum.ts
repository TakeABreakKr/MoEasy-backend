export const AuthorityEnum = {
  WAITING: 'WAITING',
  INVITED: 'INVITED',
  ACCEPTED: 'ACCEPTED',
  MEMBER: 'MEMBER',
  MANAGER: 'MANAGER',
  OWNER: 'OWNER',
} as const;

export type AuthorityEnumType = (typeof AuthorityEnum)[keyof typeof AuthorityEnum];
