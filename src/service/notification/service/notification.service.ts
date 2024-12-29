import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationService } from '@service/notification/service/notification.service.interface';
import { NotificationCheckRequest } from '@service/notification/dto/request/notification.check.request';
import { NotificationResponse } from '@service/notification/dto/response/notification.response';
import { NotificationDto } from '@service/notification/dto/response/notification.dto';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(@Inject('NotificationComponent') private notificationComponent: NotificationComponent) {}

  public async getNotifications(userId: number): Promise<NotificationResponse> {
    const notificationList: Notification[] = await this.notificationComponent.getListByUserId(userId);

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
    const notificationList: Notification[] =
      await this.notificationComponent.getListByNotificationIds(notificationIdList);

    this.validateCheckNotifications(notificationList, userId);
    notificationList.forEach((notification) => {
      notification.check();
    });

    await this.notificationComponent.saveAll(notificationList);
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
