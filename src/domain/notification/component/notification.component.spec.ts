import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { Test, TestingModule } from '@nestjs/testing';
import { Notification } from '@domain/notification/entity/notification.entity';

class MockNotificationDao implements NotificationDao {
  private notifications: Notification[];

  constructor() {
    this.notifications = [];
  }

  async getListByUserId(): Promise<Notification[]> {
    return [];
  }

  async save(notification: Notification): Promise<void> {
    this.notifications.push(notification);
  }
  async saveAll(notifications: Notification[]): Promise<void> {
    this.notifications = notifications;
  }

  async getListByNotificationIds(): Promise<Notification[]> {
    return [];
  }

  public getNotifications() {
    return this.notifications;
  }
}

describe('NotificationComponent', () => {
  let notificationComponent: NotificationComponent;
  let notificationDao: MockNotificationDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'NotificationDao',
          useClass: MockNotificationDao,
        },
        { provide: 'NotificationComponent', useClass: NotificationComponent },
      ],
    }).compile();
    notificationComponent = module.get<NotificationComponent>('NotificationComponent');
    notificationDao = module.get<MockNotificationDao>('NotificationDao');
  });

  it('addNotification', async () => {
    const content: string = 'test';
    const userId: number = 1;

    const result = await notificationComponent.addNotification(content, userId);
    expect(notificationDao.getNotifications().pop()).toStrictEqual(Notification.create(content, userId));
    expect(result).toBe(void 0);
  });

  it('addNotifications', async () => {
    const content: string = "it's test!";
    const userIdList: number[] = [1, 2, 3];
    const response: Notification[] = [
      Notification.create(content, userIdList[0]),
      Notification.create(content, userIdList[1]),
      Notification.create(content, userIdList[2]),
    ];
    const result = await notificationComponent.addNotifications(content, userIdList);
    expect(notificationDao.getNotifications()).toStrictEqual(response);
    expect(result).toBe(void 0);
  });
});
