import { NotificationCheckRequest } from '@domain/notification/dto/request/notification.check.request';
import { NotificationResponse } from '@domain/notification/dto/response/notification.response';

export interface NotificationService {
  getNotifications(userId: number): Promise<NotificationResponse>;
  checkNotifications(req: NotificationCheckRequest, userId: number): Promise<void>;
}
