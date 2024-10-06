import { ReminderEnumType } from '@enums/reminder.enum';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export interface ScheduleUpdateVO {
  name: string;
  explanation: string;
  startDate: Date;
  endDate: Date;
  reminder: ReminderEnumType[];
  announcement: string;
  onlineYn: boolean;
  address: AddressDto;
  detailAddress: string;
}
