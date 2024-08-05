import { Test, TestingModule } from '@nestjs/testing';
import { MeetingService } from '@domain/meeting/service/meeting.service';
import { MeetingController } from '@domain/meeting/controller/meeting.controller';
import { MeetingCreateRequest } from '@domain/meeting/dto/request/meeting.create.request';
import { MeetingResponse } from '@domain/meeting/dto/response/meeting.response';
import { MeetingListResponse } from '@domain/meeting/dto/response/meeting.list.response';
import { MeetingUpdateRequest } from '@domain/meeting/dto/request/meeting.update.request';
import { MeetingThumbnailUpdateRequest } from '@domain/meeting/dto/request/meeting.thumbnail.update.request';

class MockMeetingService {
  public static createMeetingResult: string = 'OOOOOOO1';

  public async createMeeting(): Promise<string> {
    return MockMeetingService.createMeetingResult;
  }

  public async updateMeeting() {}

  public async updateMeetingThumbnail() {}

  public async getMeeting(): Promise<MeetingResponse> {
    return {
      name: '',
      explanation: '',
      limit: 1,
      members: [],
      thumbnail: undefined,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeetingController],
      providers: [{ provide: MeetingService, useClass: MockMeetingService }],
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
    };

    const result = await meetingController.createMeeting(request);
    expect(result).toBe(MockMeetingService.createMeetingResult);
  });

  it('updateMeetingTest', async () => {
    const request: MeetingUpdateRequest = {
      meeting_id: '',
      name: '',
      explanation: '',
      limit: 1,
    };
    const result = await meetingController.updateMeeting(request);
    expect(result).toBe(void 0);
  });

  it('updateMeetingThumbnailTest', async () => {
    const request: MeetingThumbnailUpdateRequest = {
      meetingId: '',
      thumbnail,
    };
    const result = await meetingController.updateMeetingThumbnail(request);
    expect(result).toBe(void 0);
  });
});
