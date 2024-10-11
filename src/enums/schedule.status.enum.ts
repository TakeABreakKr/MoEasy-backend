export const ScheduleStatusEnum = {
  IN_PROGRESS: 'IN_PROGRESS',
  UPCOMING: 'UPCOMING',
  COMPLETED: 'COMPLETED',
} as const;

export type ScheduleStatusEnumType = (typeof ScheduleStatusEnum)[keyof typeof ScheduleStatusEnum];
