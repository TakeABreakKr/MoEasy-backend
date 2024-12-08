import { Inject, Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';

@Injectable()
export class NotificationComponent {
  constructor(@Inject('NotificationDao') private notificationDao: NotificationDaoImpl) {}

  public async addNotification(content: string, userId: number) {
    const notification = Notification.create(content, userId);
    await this.notificationDao.save(notification);
  }

  public async addNotifications(content: string, userIdList: number[]) {
    const notifications: Notification[] = userIdList.map((userId) => Notification.create(content, userId));
    await this.notificationDao.saveAll(notifications);
  }
}
