import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty } from 'class-validator';

export class NotificationCheckRequest {
  @ApiProperty()
  @ArrayNotEmpty()
  notificationIdList: number[];
}
