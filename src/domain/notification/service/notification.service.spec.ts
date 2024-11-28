import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationService } from '@domain/notification/service/notification.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationServiceImpl } from './notification.service';
import { NotificationResponse } from '@domain/notification/dto/response/notification.response';

class MockNotificationDao implements NotificationDao {
  async getListByUserId(): Promise<Notification[]> {
    return [];
  }
  async save(notification: Notification): Promise<void> {}
  async saveAll(notificationList: Notification[]): Promise<void> {}
  async getByIdList(notificationIdList: number[]): Promise<Notification[]> {
    return [];
  }
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const userId: number = 1;

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
    const response: NotificationResponse = {
      notificationList: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('getNotificattionsTest : fail case - null userId', async () => {
    const result = await notificationService.getNotifications(null);
    await expect(result).rejects.toThrowError();
  });

  it('getNotificattionsTest : fail case - invalid userid', async () => {});

  it('checkNotificationsTest', async () => {});
  it('checkNotificationsTest : fail case - null req', async () => {});
  it('checkNotificationsTest : fail case - null userId', async () => {});
  it('checkNotificationsTest : fail case - null parameter', async () => {});
  it('checkNotificationsTest : fail case - invalid req', async () => {});

  it('validateCheckNotificationsTest', async () => {});
  it('validateCheckNotificationsTest : fail case - null notificationList', async () => {});
  it('validateCheckNotificationsTest : fail case - null userId', async () => {});
  it('validateCheckNotificationsTest : fail case - null parameter', async () => {});
  it('validateCheckNotificationsTest : fail case - invalid NotificationList', async () => {});
  it('validateCheckNotificationsTest : fail case - invalid userId', async () => {});
});
