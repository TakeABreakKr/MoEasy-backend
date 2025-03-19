import { ReminderEnumType } from '@enums/reminder.enum';
import { Address } from '@domain/activity/entity/address.embedded';

export interface ActivityUpdateVO {
  name: string;
  explanation: string;
  startDate: Date;
  endDate: Date;
  reminder: ReminderEnumType[];
  announcement: string;
  onlineYn: boolean;
  onlineLink?: string;
  address?: Address;
  detailAddress?: string;
  participantLimit: number;
}
