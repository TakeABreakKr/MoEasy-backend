import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('NotificationDao', async () => {
  let notificationDao: NotificationDao;
  let notificationRepository: Repository<Notification>;

  const notificationRepositoryToken: string | Function = getRepositoryToken(Notification);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'notificationDao', useClass: NotificationDaoImpl },
        { provide: notificationRepositoryToken, useClass: Repository },
      ],
    }).compile();
    notificationDao = module.get<NotificationDao>('NotificationDao');
    notificationRepository = module.get<Repository<Notification>>(notificationRepositoryToken);
  });

  it('getListByUserId', async () => {});

  it('getListByUserId - success case : not found', async () => {});

  it('save', async () => {});

  it('saveAll', async () => {});

  it('getByIdList', async () => {});

  it('getByIdList - fail case : not found', async () => {});
});
