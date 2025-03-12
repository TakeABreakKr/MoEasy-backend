import { Notification } from '@domain/notification/entity/notification.entity';

export interface NotificationComponent {
  addNotification(content: string, userId: number): Promise<void>;
  addNotifications(content: string, userIdList: number[]): Promise<void>;
  getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]>;
  getListByUserId(userId: number): Promise<Notification[]>;
  saveAll(notificationList: Notification[]): Promise<void>;
}
