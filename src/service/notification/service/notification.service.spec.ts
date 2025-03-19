import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '@service/notification/service/notification.service.interface';
import { NotificationCheckRequest } from '@service/notification/dto/request/notification.check.request';
import { NotificationResponse } from '@service/notification/dto/response/notification.response';
import { NotificationServiceImpl } from '@service/notification/service/notification.service';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';

const componentAccessLog: string[] = [];

class MockNotificationComponent implements NotificationComponent {
  public static getListByUserIdLog: string = 'NotificationComponent.getListByUserId called';
  public static saveLog: string = 'NotificationComponent.save called';
  public static saveAllLog: string = 'NotificationComponent.saveAll called';
  public static getListByNotificationIdsLog: string = 'NotificationComponent.getListByNotificationIds called';

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
    componentAccessLog.push(MockNotificationComponent.getListByUserIdLog);
    if (userId === 1) {
      return [MockNotificationComponent.notification[0]];
    }
    return [];
  }
  async save(): Promise<void> {
    componentAccessLog.push(MockNotificationComponent.saveLog);
  }
  async saveAll(): Promise<void> {
    componentAccessLog.push(MockNotificationComponent.saveAllLog);
  }

  async getListByNotificationIds(notificationIdList: number[]): Promise<Notification[]> {
    componentAccessLog.push(MockNotificationComponent.getListByNotificationIdsLog);

    return MockNotificationComponent.notification.filter((notification) =>
      notificationIdList.includes(notification.id),
    );
  }
}

describe('NotificationService', () => {
  let notificationService: NotificationService;
  const usableUserId: number = 1;
  const unusableUserId: number = 5;

  beforeEach(async () => {
    componentAccessLog.length = 0;
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
    expect(componentAccessLog).toEqual([MockNotificationComponent.getListByUserIdLog]);
  });

  it('getNotificationsTest : fail case - invalid userid', async () => {
    const result = await notificationService.getNotifications(unusableUserId);
    expect(result).toStrictEqual({
      notificationList: [],
    });
    expect(componentAccessLog).toEqual([MockNotificationComponent.getListByUserIdLog]);
  });

  it('checkNotificationsTest', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [10],
    };

    const result = await notificationService.checkNotifications(req, usableUserId);
    expect(result).toBe(void 0);
    expect(MockNotificationComponent.getCheckYn(0)).toBe(true);
    expect(MockNotificationComponent.getCheckYn(1)).toBe(false);
    expect(componentAccessLog).toEqual([
      MockNotificationComponent.getListByNotificationIdsLog,
      MockNotificationComponent.saveAllLog,
    ]);
  });

  it('checkNotificationsTest : fail case - unmatched user', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [11],
    };

    await expect(notificationService.checkNotifications(req, unusableUserId)).rejects.toThrow(UnauthorizedException);
    expect(componentAccessLog).toEqual([MockNotificationComponent.getListByNotificationIdsLog]);
  });
});
