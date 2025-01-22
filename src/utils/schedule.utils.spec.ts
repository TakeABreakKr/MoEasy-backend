import { ReminderEnum, ReminderEnumType } from '@root/enums/reminder.enum';
import { ScheduleUtils } from './schedule.utils';

describe('ScheduleUtilsTest', () => {
  it('reminderListToMaskTest', async () => {
    const reminderList: ReminderEnumType[] = [
      ReminderEnum.ON_TIME,
      ReminderEnum.TEN_M,
      ReminderEnum.THIRTY_M,
      ReminderEnum.ONE_H,
      ReminderEnum.TWO_H,
    ];
    const result = ScheduleUtils.reminderListToMask(reminderList);

    expect(result).toBe(31);

    const reminderList2: ReminderEnumType[] = [ReminderEnum.ON_TIME, ReminderEnum.TEN_M, ReminderEnum.THIRTY_M];
    const result2 = ScheduleUtils.reminderListToMask(reminderList2);

    expect(result2).toBe(7);
  });

  it('maskToReminderListTest', async () => {
    const mask = 31;
    const result = ScheduleUtils.maskToReminderList(mask);

    expect(result).toEqual([
      ReminderEnum.ON_TIME,
      ReminderEnum.TEN_M,
      ReminderEnum.THIRTY_M,
      ReminderEnum.ONE_H,
      ReminderEnum.TWO_H,
    ]);

    const mask2 = 7;
    const result2 = ScheduleUtils.maskToReminderList(mask2);

    expect(result2).toEqual([ReminderEnum.ON_TIME, ReminderEnum.TEN_M, ReminderEnum.THIRTY_M]);
  });
});
