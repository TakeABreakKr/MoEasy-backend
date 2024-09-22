import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from '@domain/notification/dto/response/notification.dto';

export class NotificationResponse {
  @ApiProperty()
  notificationList: NotificationDto[];
}
