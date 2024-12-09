import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { Repository } from 'typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { getRepositoryToken } from '@nestjs/typeorm';

class MockNotificationRepository extends Repository<Notification> {
  option: FindOptionsWhere<Notification> = {
    users_id: undefined,
  };

  async save(): Promise<any[]> {
    return;
  }

  async findBy(where: FindOptionsWhere<Notification> | FindOptionsWhere<Notification>[]): Promise<Notification[]> {
    const notification = Notification.create('아무말', 1);
    const notification2 = Notification.create('알림', 2);
    const condition: FindOptionsWhere<Notification> = { users_id: 1 };
    const condition2: FindOptionsWhere<Notification>[] = [condition, { users_id: 2 }];
    if (where.users_id == condition.users_id) return [notification];
    if (where == condition2) return [notification, notification2];
    console.log(where);
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
    const notification = Notification.create('아무말', 1);
    expect(result).toStrictEqual(notification);
  });

  it('getListByUserId - case : not found', async () => {});

  it('save', async () => {});

  it('saveAll', async () => {});

  it('getByIdList', async () => {});

  it('getByIdList - fail case : not found', async () => {});
});
