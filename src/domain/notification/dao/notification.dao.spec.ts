import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDaoImpl } from '@domain/notification/dao/notification.dao';

describe('NotificationDao', async () => {
  let notificationDao: NotificationDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: 'notificationDao', useClass: NotificationDaoImpl }],
    }).compile();
    notificationDao = module.get<NotificationDao>('NotificationDao');
  });
});
