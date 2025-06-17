import { ActivityService } from '@service/activity/service/activity.service.interface';
import { ActivityResponse } from '@service/activity/dto/response/activity.response';
import { ActivityListResponse } from '@service/activity/dto/response/activity.list.response';
import { ActivityController } from '@service/activity/controller/activity.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ActivityCreateRequest } from '@service/activity/dto/request/activity.create.request';
import { AuthUser } from '@decorator/token.decorator';
import { ActivityUpdateRequest } from '@service/activity/dto/request/activity.update.request';
import { MeetingUtils } from '@utils/meeting.utils';
import { ActivityParticipantRequest } from '@service/activity/dto/request/activity.participant.request';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';

class MockActivityService implements ActivityService {
  async createActivity(): Promise<string> {
    return 'OOOOOOO1';
  }
  async updateActivity() {}
  async getActivity(): Promise<ActivityResponse> {
    return {
      name: 'activity name',
      startDate: new Date(),
      notice: 'moeasa',
      onlineYn: true,
      thumbnailId: 50,
      participantLimit: 10,
      participantCount: 10,
      onlineLink: 'onlineLink',
      members: [],
      isJoined: false,
      noticeImageIds: [],
    };
  }
  async getActivityList(): Promise<ActivityListResponse> {
    return {
      activityList: [],
      meetings: [],
    };
  }
  async cancelActivity() {}
  async deleteActivity() {}
  async joinActivity() {}
}

describe('ActivityController', () => {
  let activityController: ActivityController;
  const activityId = 'OOOOOOO1';
  const user: AuthUser = {
    id: 1,
    name: 'yun',
    issueDate: Date.now(),
  };

  const activityCreateRequest: ActivityCreateRequest = {
    meetingId: 'OOOOOOO1',
    name: 'activity name',
    startDate: new Date(),
    endDate: null,
    reminder: [],
    notice: 'moeasa',
    address: null,
    detailAddress: null,
    onlineYn: true,
    participants: [],
    participantLimit: 10,
    thumbnail: null,
    noticeImages: null,
    onlineLink: 'onlineLink',
  };

  const mockThumbnail = {
    fieldname: 'thumbnail',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 4,
    destination: '',
    filename: '',
    stream: undefined,
    path: '',
  };

  const mockNoticeImage = {
    fieldname: 'noticeImages',
    originalname: 'notice.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    buffer: Buffer.from('test'),
    size: 4,
    destination: '',
    filename: '',
    stream: undefined,
    path: '',
  };

  const mockFiles = {
    thumbnail: [mockThumbnail],
    noticeImages: [mockNoticeImage],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [{ provide: 'ActivityService', useClass: MockActivityService }],
    }).compile();
    activityController = module.get<ActivityController>(ActivityController);
  });

  it('createActivityTest', async () => {
    const req: ActivityCreateRequest = {
      ...activityCreateRequest,
    };

    const result = await activityController.createActivity(req, mockFiles, user);
    expect(result).toStrictEqual(activityId);
  });

  it('updateActivityTest', async () => {
    const req: ActivityUpdateRequest = {
      ...activityCreateRequest,
      activityId: MeetingUtils.transformMeetingIdToInteger(activityId),
    };
    const result = await activityController.updateActivity(req, mockFiles, user);
    expect(result).toBe(void 0);
  });

  it('getActivityTest', async () => {
    const activityId = 1;
    const result = await activityController.getActivity(activityId, user);

    const response: ActivityResponse = {
      name: 'activity name',
      startDate: new Date(),
      notice: 'moeasa',
      onlineYn: true,
      thumbnailId: 50,
      participantLimit: 10,
      participantCount: 10,
      onlineLink: 'onlineLink',
      members: [],
      isJoined: false,
      noticeImageIds: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('getActivityListTest', async () => {
    const result = await activityController.getActivityList(user, [], OrderingOptionEnum.NAME);
    const response: ActivityListResponse = {
      activityList: [],
      meetings: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('withdrawTest', async () => {
    const req: ActivityParticipantRequest = {
      meetingId: 'OOOOOOO1',
      activityId: 1,
    };
    const result = await activityController.cancelActivity(req, user);
    expect(result).toBe(void 0);
  });

  it('deleteActivityTest', async () => {
    const req: ActivityDeleteRequest = {
      meetingId: 'OOOOOOO1',
      activityId: 1,
    };
    const result = await activityController.delete(req, user);
    expect(result).toBe(void 0);
  });
});
