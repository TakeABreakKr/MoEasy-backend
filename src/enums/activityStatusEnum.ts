export const ActivityStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
} as const;

export type ActivityStatusEnumType = (typeof ActivityStatusEnum)[keyof typeof ActivityStatusEnum];
