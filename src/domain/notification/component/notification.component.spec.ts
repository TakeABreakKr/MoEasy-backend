import { NotificationDao } from '@domain/notification/dao/notification.dao.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { Test, TestingModule } from '@nestjs/testing';
import { Notification } from '@domain/notification/entity/notification.entity';

class MockNotificationDao implements NotificationDao {
  async getListByUserId(): Promise<Notification[]> {
    return [];
  }

  async save(): Promise<void> {}
  async saveAll(): Promise<void> {}

  async getByIdList(): Promise<Notification[]> {
    return [];
  }
}

describe('NotificationComponent', () => {
  let notificationComponent: NotificationComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'NotificationDao',
          useClass: MockNotificationDao,
        },
      ],
    }).compile();
    notificationComponent = module.get<NotificationComponent>('NotificationComponent');
  });

  it('addNotification', async () => {
    const content: string = 'test';
    const userId: number = 1;

    expect(notificationComponent.addNotification(content, userId)).toBe(void 0);
  });

  it('addNotifications', async () => {
    const content: string = "it's test!";
    const userIdList: number[] = [1];

    expect(notificationComponent.addNotifications(content, userIdList)).toBe(void 0);
  });
});
