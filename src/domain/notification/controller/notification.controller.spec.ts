import { NotificationService } from '@domain/notification/service/notification.service.interface';
import { NotificationResponse } from '@domain/notification/dto/response/notification.response';
import { NotificationController } from '@domain/notification/controller/notification.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '@decorator/token.decorator';
import { NotificationCheckRequest } from '@domain/notification/dto/request/notification.check.request';

class MockNotificationService implements NotificationService {
  async getNotifications(): Promise<NotificationResponse> {
    return {
      notificationList: [],
    };
  }
  async checkNotifications(): Promise<void> {}
}

describe('NotificationController', () => {
  let notificationController: NotificationController;

  const user: AuthUser = {
    id: 1,
    name: 'yun',
    issueDate: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [{ provide: 'NotificationService', useClass: MockNotificationService }],
    }).compile();
    notificationController = module.get<NotificationController>(NotificationController);
  });

  it('getNotificationTest', async () => {
    const response: NotificationResponse = {
      notificationList: [],
    };

    const result = await notificationController.getNotifications(user);
    expect(result).toStrictEqual(response);
  });

  it('checkNotificationTest', async () => {
    const request: NotificationCheckRequest = {
      notificationIdList: [],
    };
    const result = await notificationController.checkNotification(request, user);
    expect(result).toBe(void 0);
  });
});
