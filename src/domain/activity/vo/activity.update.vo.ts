import { ReminderEnumType } from '@enums/reminder.enum';
import { Address } from '@domain/activity/entity/address.embedded';

export interface ActivityUpdateVO {
  name: string;
  thumbnailId: number;
  thumbnailPath: string;
  startDate: Date;
  endDate: Date;
  reminder: ReminderEnumType[];
  notice?: string;
  onlineYn: boolean;
  onlineLink?: string;
  address?: Address;
  detailAddress?: string;
  participantLimit: number;
}
