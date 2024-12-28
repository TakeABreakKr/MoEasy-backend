import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';

@Injectable()
export class NotificationComponentImpl implements NotificationComponent {
  constructor(private notificationDao: NotificationDao) {}

  public async addNotification(content: string, userId: number) {
    const notification = Notification.create(content, userId);
    await this.notificationDao.save(notification);
  }

  public async addNotifications(content: string, userIdList: number[]) {
    const notifications: Notification[] = userIdList.map((userId) => Notification.create(content, userId));
    await this.notificationDao.saveAll(notifications);
  }

  public async getByIdList(notificationIdList: number[]): Promise<Notification[]> {
    return this.notificationDao.getByIdList(notificationIdList);
  }

  public async getListByUserId(userId: number): Promise<Notification[]> {
    return this.notificationDao.getListByUserId(userId);
  }

  public async saveAll(notificationList: Notification[]) {
    await this.notificationDao.saveAll(notificationList);
  }
}
