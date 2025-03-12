import { Notification } from '@domain/notification/entity/notification.entity';

export interface NotificationDao {
  getListByUserId(userId: number): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
  saveAll(notificationList: Notification[]): Promise<void>;
  getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]>;
}
