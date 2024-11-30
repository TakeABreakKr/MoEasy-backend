import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { NotificationService } from '@domain/notification/service/notification.service.interface';
import { NotificationCheckRequest } from '@domain/notification/dto/request/notification.check.request';
import { NotificationResponse } from '@domain/notification/dto/response/notification.response';
import { NotificationServiceImpl } from './notification.service';
import { Notification } from '../entity/notification.entity';

class MockNotificationDao implements NotificationDao {
  private readonly notification: Notification;

  constructor() {
    this.notification = Notification.create('content', 1);
    this.notification.notification_id = 1;
  }

  async getListByUserId(userId): Promise<Notification[]> {
    if (userId === 1) {
      return [this.notification];
    }
    return [];
  }

  async save(): Promise<void> {}
  async saveAll(): Promise<void> {}

  async getByIdList(notificationIdList: number[]): Promise<Notification[]> {
    if (notificationIdList.includes(1)) {
      return [this.notification];
    }

    return [];
  }
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const usableUserId: number = 1;
  const unusableUserId: number = 2;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'NotificationService', useClass: NotificationServiceImpl },
        { provide: 'NotificationDao', useClass: MockNotificationDao },
      ],
    }).compile();
    notificationService = module.get<NotificationService>('NotificationService');
  });

  it('getNotificationsTest', async () => {
    const result = await notificationService.getNotifications(usableUserId);
    const notificationResponse: NotificationResponse = {
      notificationList: [
        {
          id: 1,
          content: 'content',
        },
      ],
    };
    expect(result).toStrictEqual(notificationResponse);
  });

  it('getNotificationsTest : fail case - invalid userid', async () => {
    const result = await notificationService.getNotifications(unusableUserId);
    expect(result).toStrictEqual({
      notificationList: [],
    });
  });

  it('checkNotificationsTest', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [1],
    };

    expect(await notificationService.checkNotifications(req, usableUserId)).toBe(void 0);
  });

  it('checkNotificationsTest : fail case - null req', async () => {
    expect(notificationService.checkNotifications(null, usableUserId)).rejects.toThrow(BadRequestException);
  });

  it('checkNotificationsTest : fail case - unmatched user', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [1],
    };

    expect(notificationService.checkNotifications(req, unusableUserId)).rejects.toThrow(UnauthorizedException);
  });
});
