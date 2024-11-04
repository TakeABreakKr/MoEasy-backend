import { Test, TestingModule } from '@nestjs/testing';
import { MeetingController } from '@domain/meeting/controller/meeting.controller';
import { MeetingCreateRequest } from '@domain/meeting/dto/request/meeting.create.request';
import { MeetingResponse } from '@domain/meeting/dto/response/meeting.response';
import { MeetingListResponse } from '@domain/meeting/dto/response/meeting.list.response';
import { MeetingUpdateRequest } from '@domain/meeting/dto/request/meeting.update.request';
import { MeetingThumbnailUpdateRequest } from '@domain/meeting/dto/request/meeting.thumbnail.update.request';
import { MeetingService } from '@domain/meeting/service/meeting.service.interface';
import { AuthUser } from '@decorator/token.decorator';
import { AuthorityEnum } from '@enums/authority.enum';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { Meeting } from '@domain/meeting/entity/meeting.entity';

class MockMeetingService implements MeetingService {
  public static meetingId: string = 'OOOOOOO1';

  public async createMeeting(): Promise<string> {
    return MockMeetingService.meetingId;
  }

  public async updateMeeting() {}

  public async updateMeetingThumbnail() {}

  public async deleteMeeting() {}

  public async getMeeting(): Promise<MeetingResponse> {
    return {
      name: '',
      explanation: '',
      limit: 1,
      members: [],
      thumbnail: undefined,
      canJoin: false,
    };
  }

  public async getMeetingList(): Promise<MeetingListResponse> {
    return {
      meetingList: [],
    };
  }
}

describe('MeetingController', () => {
  let meetingController: MeetingController;
  const thumbnail = {
    fieldname: '',
    originalname: 'testFile.jpg',
    encoding: 'BASE64',
    mimetype: 'multipart/form-data',
    size: 0,
    stream: undefined,
    destination: '',
    filename: '',
    path: '',
    buffer: undefined,
  };

  const user: AuthUser = {
    id: 1,
    name: '',
    issueDate: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [{ provide: 'MeetingService', useClass: MockMeetingService }],
    }).compile();
    meetingController = module.get<MeetingController>(MeetingController);
  });

  it('createMeetingTest', async () => {
    const request: MeetingCreateRequest = {
      thumbnail,
      name: '',
      explanation: '',
      keywords: [],
      limit: 1,
      members: [],
      canJoin: false,
    };

    const result = await meetingController.createMeeting(request, user);
    expect(result).toBe(MockMeetingService.meetingId);
  });

  it('updateMeetingTest', async () => {
    const request: MeetingUpdateRequest = {
      meeting_id: '',
      name: '',
      explanation: '',
      limit: 1,
      canJoin: false,
    };
    const result = await meetingController.updateMeeting(request, user);
    expect(result).toBe(void 0);
  });

  it('updateMeetingThumbnailTest', async () => {
    const request: MeetingThumbnailUpdateRequest = {
      meetingId: '',
      thumbnail,
    };
    const result = await meetingController.updateMeetingThumbnail(request, user);
    expect(result).toBe(void 0);
  });

  it('deleteMeetingTest', async () => {
    const result = await meetingController.deleteMeeting(MockMeetingService.meetingId, user);
    expect(result).toBe(void 0);
  });

  it('getMeetingTest', async () => {
    const result = await meetingController.getMeeting(MockMeetingService.meetingId);
    const response: MeetingResponse = {
      name: '',
      explanation: '',
      limit: 1,
      members: [],
      thumbnail: undefined,
      canJoin: false,
    };
    expect(result).toStrictEqual(response);
  });

  it('getMeetingListTest', async () => {
    const result = await meetingController.getMeetingList([AuthorityEnum.MEMBER], OrderingOptionEnum.NAME, user);
    const response: MeetingListResponse = {
      meetingList: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('lookAroundMeetingListTest', async () => {
    const result = await meetingController.lookAroundMeetingList();
    const response: MeetingListResponse = {
      meetingList: [],
    };
    expect(result).toStrictEqual(response);
  });
});
