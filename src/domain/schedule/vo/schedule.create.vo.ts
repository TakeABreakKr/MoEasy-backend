import { ReminderEnumType } from '@enums/reminder.enum';
import { AddressDto } from '@service/schedule/dto/request/schedule.address.dto';

export interface ScheduleCreateVO {
  meetingId: string;
  name: string;
  explanation: string;
  startDate: Date;
  endDate: Date;
  reminder: ReminderEnumType[];
  announcement: string;
  onlineYn: boolean;
  address?: AddressDto;
  detailAddress?: string;
}
