import { ReminderEnum, ReminderEnumKeyType, ReminderEnumType } from '@enums/reminder.enum';

export class ScheduleUtils {
  public static reminderListToMask(reminderList: ReminderEnumType[]): number {
    let mask: number = 0;
    const enumList = Object.keys(ReminderEnum);
    reminderList.forEach((reminder) => {
      const index: number = enumList.indexOf(reminder);
      mask += 2 ** index; // 2^index
    });

    return mask;
  }

  public static maskToReminderList(mask: number): ReminderEnumType[] {
    const binary: string = mask.toString(2);
    const enumList = Object.keys(ReminderEnum);
    return enumList
      .filter((reminderKey) => binary.charAt(enumList.indexOf(reminderKey)) === '1')
      .map((reminderKey: ReminderEnumKeyType): ReminderEnumType => ReminderEnum[reminderKey]);
  }
}
