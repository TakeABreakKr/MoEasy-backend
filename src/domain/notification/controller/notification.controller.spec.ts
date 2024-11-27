import { NotificationService } from '../service/notification.service.interface';
import { NotificationResponse } from '../dto/response/notification.response';
import { NotificationCheckRequest } from '../dto/request/notification.check.request';
import { NotificationController } from '../controller/notification.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthUser } from '@decorator/token.decorator';

class MockNotificationService implements NotificationService {
  public async getNotifications(): Promise<NotificationResponse> {
    return {
      notificationList: [],
    };
  }
  public async checkNotifications(): Promise<void> {}
}

describe('NotificationController', () => {
  let notificationController: NotificationController;

  const user: AuthUser = {
    id: 1,
    name: 'John',
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
    const result = await notificationController.getNotifications(user);
    const response: NotificationResponse = {
      notificationList: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('checkNotificationTest', async () => {
    const req: NotificationCheckRequest = {
      notificationIdList: [],
    };
    const result = await notificationController.checkNotification(req, user);
    expect(result).toBe(void 0);
  });
});
