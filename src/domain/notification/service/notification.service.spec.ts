import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Notification } from '../entity/notification.entity';
import { NotificationService } from '@domain/notification/service/notification.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServiceImpl } from './notification.service';
import { NotificationResponse } from '@domain/notification/dto/response/notification.response';
import { NotificationCheckRequest } from '@domain/notification/dto/request/notification.check.request';

class MockNotificationDao implements NotificationDao {
  async getListByUserId(): Promise<Notification[]> {
    return [];
  }
  async save(): Promise<void> {}
  async saveAll(): Promise<void> {}
  async getByIdList(): Promise<Notification[]> {
    const noti: Notification = Notification.create('', 1);
    noti.notification_id = 1;
    return [noti];
  }
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const userId: number = 1;
  const response: NotificationResponse = {
    notificationList: [],
  };
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
    const result = await notificationService.getNotifications(userId);
    expect(result).toStrictEqual(response);
  });
  it('getNotificationsTest : fail case - invalid userid', async () => {
    const id = 1234;
    const result = await notificationService.getNotifications(id);
    expect(result).toStrictEqual(response);
  });

  it('checkNotificationsTest', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [],
    };
    const result = await notificationService.checkNotifications(req, userId);
    expect(result).toBe(void 0);
  });
  it('checkNotificationsTest : fail case - null req', async () => {
    await expect(notificationService.checkNotifications(null, userId)).rejects.toThrow(TypeError);
  });
  it('checkNotificationsTest : fail case - null parameter', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [1],
    };
    const result = await notificationService.checkNotifications(req, null);
    expect(result).toBe(void 0);
  });

  it('validateCheckNotificationsTest', async () => {
    const result = notificationService.validateCheckNotifications([], userId);
    expect(result).toBe(void 0);
  });
  it('validateCheckNotificationsTest : fail case - null notificationList', async () => {});
  it('validateCheckNotificationsTest : fail case - null userId', async () => {});
  it('validateCheckNotificationsTest : fail case - null parameter', async () => {});
  it('validateCheckNotificationsTest : fail case - invalid NotificationList', async () => {});
  it('validateCheckNotificationsTest : fail case - invalid userId', async () => {});
});
