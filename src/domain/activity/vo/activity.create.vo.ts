import { ReminderEnumType } from '@enums/reminder.enum';
import { Address } from '@domain/activity/entity/address.embedded';

export interface ActivityCreateVO {
  meetingId: string;
  name: string;
  startDate: Date;
  endDate: Date;
  reminder: ReminderEnumType[];
  notice?: string;
  onlineYn: boolean;
  address?: Address;
  detailAddress?: string;
  onlineLink?: string;
  participantLimit: number;
  thumbnailId: number;
  noticeImageId?: number;
}
