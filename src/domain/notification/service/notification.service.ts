import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationService } from '@domain/notification/service/notification.service.interface';
import { NotificationCheckRequest } from '../dto/request/notification.check.request';
import { NotificationResponse } from '../dto/response/notification.response';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { NotificationDto } from '@domain/notification/dto/response/notification.dto';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(private notificationDao: NotificationDao) {}

  public async getNotifications(userId: number): Promise<NotificationResponse> {
    const notificationList: Notification[] = await this.notificationDao.getListByUserId(userId);

    return {
      notificationList: notificationList.map((notification: Notification): NotificationDto => {
        return {
          id: notification.notification_id,
          content: notification.content,
        };
      }),
    };
  }

  public async checkNotifications(req: NotificationCheckRequest, userId: number): Promise<void> {
    const notificationIdList: number[] = req.notificationIdList;
    const notificationList: Notification[] = await this.notificationDao.getByIdList(notificationIdList);

    this.validateCheckNotifications(notificationList, userId);
    notificationList.forEach((notification) => {
      notification.check();
    });

    await this.notificationDao.saveAll(notificationList);
  }

  private validateCheckNotifications(notificationList: Notification[], userId: number) {
    const ownedNotificationCount: number = notificationList.filter((notification) => {
      return notification.users_id === userId;
    }).length;

    if (ownedNotificationCount !== notificationList.length) {
      throw new UnauthorizedException(ErrorMessageType.WRONG_NOTIFICATION_OWNER);
    }
  }
}
