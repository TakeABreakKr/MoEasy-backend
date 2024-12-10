import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { FindOptionsWhere, In, Repository } from 'typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockNotificationRepository extends Repository<Notification> {
  public static userIdList: number[] = [1, 2];
  public static notifications: Notification[] = [
    Notification.create('아무말', MockNotificationRepository.userIdList[0]),
    Notification.create('알림', MockNotificationRepository.userIdList[1]),
    Notification.create('세번째', MockNotificationRepository.userIdList[1]),
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
    if (option.users_id === MockNotificationRepository.userIdList[0]) {
      return [MockNotificationRepository.notifications[0]];
    }
    if (option.users_id === MockNotificationRepository.userIdList[1]) {
      return MockNotificationRepository.notifications.slice(1);
    }
    if (option.users_id === In(MockNotificationRepository.userIdList)) {
      return MockNotificationRepository.notifications;
    }
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

  it('getListByUserId', async () => {
    const userId: number = 1;
    const result = await notificationDao.getListByUserId(userId);
    const expected = [MockNotificationRepository.notifications[0]];
    expect(result).toStrictEqual(expected);
  });

  it('getListByUserId - case : not found', async () => {});

  it('save', async () => {});

  it('saveAll', async () => {});

  it('getByIdList', async () => {});

  it('getByIdList - fail case : not found', async () => {});
});
