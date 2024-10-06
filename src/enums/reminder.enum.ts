export const ReminderEnum = {
  ON_TIME: 'ON_TIME', //M : MINUTE, H : HOUR, D : DAY
  TEN_M: 'TEM_M',
  THIRTY_M: 'THIRTY_M',
  ONE_H: 'ONE_H',
  TWO_H: 'TWO_H',
  THREE_H: 'THREE_H',
  FOUR_H: 'FOUR_H',
  SIX_H: 'SIX_H',
  TWELVE_H: 'TWELVE_H',
  ONE_D: 'ONE_D',
  TWO_D: 'TWO_D',
  THREE_D: 'THREE_D',
  SEVEN_D: 'SEVEN_D',
} as const;

export type ReminderEnumKeyType = keyof typeof ReminderEnum;
export type ReminderEnumType = (typeof ReminderEnum)[ReminderEnumKeyType];
