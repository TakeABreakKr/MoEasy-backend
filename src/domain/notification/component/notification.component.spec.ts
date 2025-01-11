import { Test, TestingModule } from '@nestjs/testing';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationComponentImpl } from '@domain/notification/component/notification.component';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';

const daoAccessLog: string[] = [];

class MockNotificationDao implements NotificationDao {
  public static getListByUserIdLog: string = 'NotificationDao.getListByUserId called';
  public static saveLog: string = 'NotificationDao.save called';
  public static saveAllLog: string = 'NotificationDao.saveAll called';
  public static getListByNotificationIdsLog: string = 'NotificationDao.getListByNotificationIdsLog called';

  private notifications: Notification[] = [
    Notification.createForTest(10, '안녕하세요?', 100),
    Notification.createForTest(11, '안녕못해요?', 100),
    Notification.createForTest(12, '알림이에요', 200),
    Notification.createForTest(13, '공지예요', 300),
  ];

  async getListByUserId(userId: number): Promise<Notification[]> {
    daoAccessLog.push(MockNotificationDao.getListByUserIdLog);
    return this.notifications.filter((notification: Notification) => {
      if (notification.users_id === userId) return notification;
    });
  }

  async save(notification: Notification): Promise<void> {
    this.notifications.push(notification);
    daoAccessLog.push(MockNotificationDao.saveLog);
  }
  async saveAll(notifications: Notification[]): Promise<void> {
    this.notifications = notifications;
    daoAccessLog.push(MockNotificationDao.saveAllLog);
  }

  async getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]> {
    daoAccessLog.push(MockNotificationDao.getListByNotificationIdsLog);
    return this.notifications.filter((notification: Notification) =>
      notificationIdList.includes(notification.notification_id),
    );
  }

  //only for test
  async getListByUserIds(userId: number[]): Promise<Notification[]> {
    return this.notifications.filter((notification: Notification) => userId.includes(notification.users_id));
  }
}

describe('NotificationComponent', () => {
  let notificationComponent: NotificationComponent;
  let notificationDao: MockNotificationDao;

  beforeEach(async () => {
    daoAccessLog.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'NotificationDao',
          useClass: MockNotificationDao,
        },
        { provide: 'NotificationComponent', useClass: NotificationComponentImpl },
      ],
    }).compile();
    notificationComponent = module.get<NotificationComponent>('NotificationComponent');
    notificationDao = module.get<MockNotificationDao>('NotificationDao');
  });

  it('addNotification', async () => {
    const content: string = 'test';
    const userId: number = 1;

    const result = await notificationComponent.addNotification(content, userId);
    const notifications = await notificationDao.getListByUserId(userId);
    expect(notifications.shift()).toStrictEqual(Notification.create(content, userId));
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockNotificationDao.saveLog, MockNotificationDao.getListByUserIdLog]);
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
    expect(daoAccessLog).toEqual([MockNotificationDao.saveAllLog]);
    const notifications = await notificationDao.getListByUserIds(userIdList);
    expect(notifications).toStrictEqual(response);
    expect(result).toBe(void 0);
  });

  it('getListByNotificationIds', async () => {
    const notificationIds: number[] = [12, 13];
    const response: Notification[] = [
      Notification.createForTest(12, '알림이에요', 200),
      Notification.createForTest(13, '공지예요', 300),
    ];

    const result = await notificationComponent.getListByNotificationIds(notificationIds);
    expect(result.length).toBe(2);
    expect(result).toStrictEqual(response);
    expect(daoAccessLog).toEqual([MockNotificationDao.getListByNotificationIdsLog]);
  });

  it('getListByUserId', async () => {
    const userId: number = 100;
    const response: Notification[] = [
      Notification.createForTest(10, '안녕하세요?', 100),
      Notification.createForTest(11, '안녕못해요?', 100),
    ];

    const result = await notificationDao.getListByUserId(userId);
    expect(result.length).toBe(2);
    expect(result).toStrictEqual(response);
    expect(daoAccessLog).toEqual([MockNotificationDao.getListByUserIdLog]);
  });

  it('saveAll', async () => {
    const notifications: Notification[] = [
      Notification.create('테스트용', 123),
      Notification.create('알림갑니다?', 456),
    ];

    await notificationDao.saveAll(notifications);
    expect(daoAccessLog).toEqual([MockNotificationDao.saveAllLog]);
    const notification1 = await notificationDao.getListByUserId(123);
    const notification2 = await notificationDao.getListByUserId(456);
    expect(notification1.pop()).toStrictEqual(notifications[0]);
    expect(notification2.pop()).toStrictEqual(notifications[1]);
  });
});
