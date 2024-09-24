import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDao } from '@domain/notification/dao/notification.dao';

@Injectable()
export class NotificationComponent {
  constructor(private notificationDao: NotificationDao) {}

  public async addNotification(content: string, userId: number) {
    const notification = Notification.create(content, userId);
    await this.notificationDao.save(notification);
  }
}
