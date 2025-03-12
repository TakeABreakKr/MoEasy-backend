import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockNotificationRepository extends Repository<Notification> {
  public static userIdList: number[] = [10, 20];
  public static notificationIds: number[] = [1, 2, 3];
  public static notifications: Notification[] = [
    Notification.createForTest(1, '아무말', MockNotificationRepository.userIdList[0]),
    Notification.createForTest(2, '알림', MockNotificationRepository.userIdList[1]),
    Notification.createForTest(3, '세번째', MockNotificationRepository.userIdList[1]),
  ];

  async save(notification: Notification | Notification[]): Promise<any> {
    return notification;
  }

  async findBy(where: FindOptionsWhere<Notification> | FindOptionsWhere<Notification>[]): Promise<Notification[]> {
    if (where instanceof Array) {
      return [
        ...where
          .map(this.getMockNotificationsByUserId)
          .reduce((acc, cur) => new Set([...acc, ...cur]), new Set<Notification>()),
      ];
    }
    return this.getMockNotificationsByUserId(where);
  }

  private getMockNotificationsByUserId(option: FindOptionsWhere<Notification>): Notification[] {
    if (option.userId === MockNotificationRepository.userIdList[0]) {
      return [MockNotificationRepository.notifications[0]];
    }
    if (option.userId === MockNotificationRepository.userIdList[1]) {
      return MockNotificationRepository.notifications.slice(1);
    }
    if (option.id) return MockNotificationRepository.notifications;
    return [];
  }
}

describe('NotificationDao', () => {
  let notificationDao: NotificationDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: 'NotificationDao', useClass: NotificationDaoImpl },
        { provide: getRepositoryToken(Notification), useClass: MockNotificationRepository },
      ],
    }).compile();

    notificationDao = module.get<NotificationDao>('NotificationDao');
  });

  it('getListByUserId - case : one', async () => {
    const userId: number = 10;
    const result = await notificationDao.getListByUserId(userId);
    const expected = [MockNotificationRepository.notifications[0]];

    expect(result).toStrictEqual(expected);
  });

  it('getListByUserId - case : not found', async () => {
    const userId: number = 12345;
    const result = await notificationDao.getListByUserId(userId);

    expect(result).toStrictEqual([]);
  });

  it('save', async () => {
    const result = await notificationDao.save(MockNotificationRepository.notifications[0]);

    expect(result).toBe(void 0);
  });

  it('saveAll', async () => {
    const result = await notificationDao.saveAll(MockNotificationRepository.notifications);

    expect(result).toBe(void 0);
  });

  it('getListByNotificationIds', async () => {
    const result = await notificationDao.getListByNotificationIds(MockNotificationRepository.notificationIds);
    const expected: Notification[] = MockNotificationRepository.notifications;

    expect(result).toStrictEqual(expected);
  });
});
