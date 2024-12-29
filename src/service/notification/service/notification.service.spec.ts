import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service.interface';
import { NotificationCheckRequest } from '../dto/request/notification.check.request';
import { NotificationResponse } from '../dto/response/notification.response';
import { NotificationServiceImpl } from './notification.service';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';

const daoAccessLog: string[] = [];

class MockNotificationComponent implements NotificationComponent {
  public static notification: Notification[] = [
    Notification.createForTest(10, 'content', 1),
    Notification.createForTest(11, 'test content', 2),
  ];

  public static getCheckYn(index: number): boolean {
    return this.notification[index].checkedYn;
  }

  async addNotification(): Promise<void> {}
  async addNotifications(): Promise<void> {}

  async getListByUserId(userId: number): Promise<Notification[]> {
    daoAccessLog.push('NotificationComponent.getListByUserId called');
    if (userId === 1) {
      return [MockNotificationComponent.notification[0]];
    }
    return [];
  }
  async save(): Promise<void> {
    daoAccessLog.push('NotificationComponent.save called');
  }
  async saveAll(): Promise<void> {
    daoAccessLog.push('NotificationComponent.saveAll called');
  }

  async getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]> {
    daoAccessLog.push('NotificationComponent.getListByNotificationIds called');

    return MockNotificationComponent.notification.filter((notification) =>
      notificationIdList.includes(notification.notification_id),
    );
  }
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const usableUserId: number = 1;
  const unusableUserId: number = 5;

  beforeEach(async () => {
    daoAccessLog.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'NotificationService', useClass: NotificationServiceImpl },
        { provide: 'NotificationComponent', useClass: MockNotificationComponent },
      ],
    }).compile();
    notificationService = module.get<NotificationService>('NotificationService');
  });

  it('getNotificationsTest', async () => {
    const result = await notificationService.getNotifications(usableUserId);
    const notificationResponse: NotificationResponse = {
      notificationList: [
        {
          id: 10,
          content: 'content',
        },
      ],
    };
    expect(result).toStrictEqual(notificationResponse);
    expect(daoAccessLog).toEqual(['NotificationComponent.getListByUserId called']);
  });

  it('getNotificationsTest : fail case - invalid userid', async () => {
    const result = await notificationService.getNotifications(unusableUserId);
    expect(result).toStrictEqual({
      notificationList: [],
    });
    expect(daoAccessLog).toEqual(['NotificationComponent.getListByUserId called']);
  });

  it('checkNotificationsTest', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [10],
    };

    const result = await notificationService.checkNotifications(req, usableUserId);
    expect(result).toBe(void 0);
    expect(MockNotificationComponent.getCheckYn(0)).toBe(true);
    expect(MockNotificationComponent.getCheckYn(1)).toBe(false);
    expect(daoAccessLog).toEqual([
      'NotificationComponent.getListByNotificationIds called',
      'NotificationComponent.saveAll called',
    ]);
  });

  it('checkNotificationsTest : fail case - unmatched user', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [11],
    };

    await expect(notificationService.checkNotifications(req, unusableUserId)).rejects.toThrow(UnauthorizedException);
    expect(daoAccessLog).toEqual(['NotificationComponent.getListByNotificationIds called']);
  });
});
