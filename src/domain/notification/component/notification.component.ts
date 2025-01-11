import { Inject, Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';

@Injectable()
export class NotificationComponentImpl implements NotificationComponent {
  constructor(@Inject('NotificationDao') private notificationDao: NotificationDao) {}

  public async addNotification(content: string, userId: number) {
    const notification = Notification.create(content, userId);
    await this.notificationDao.save(notification);
  }

  public async addNotifications(content: string, userIdList: number[]) {
    const notifications: Notification[] = userIdList.map((userId) => Notification.create(content, userId));
    await this.notificationDao.saveAll(notifications);
  }

  public async getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]> {
    return this.notificationDao.getListByNotificationIds(notificationIdList);
  }

  public async getListByUserId(userId: number): Promise<Notification[]> {
    return this.notificationDao.getListByUserId(userId);
  }

  public async saveAll(notificationList: Notification[]) {
    await this.notificationDao.saveAll(notificationList);
  }
}
