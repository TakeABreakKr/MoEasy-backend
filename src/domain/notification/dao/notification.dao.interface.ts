import { Notification } from '../entity/notification.entity';

export interface NotificationDao {
  getListByUserId(userId: number): Promise<Notification[]>;
  save(notification: Notification): Promise<void>;
  saveAll(notificationList: Notification[]): Promise<void>;
  getByIdList(notificationIdList: number[]): Promise<Notification[]>;
}
