import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleResponse } from '@domain/schedule/dto/response/schedule.response';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ScheduleController } from '@domain/schedule/controller/schedule.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { AuthUser } from '@decorator/token.decorator';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';
import { MeetingUtils } from '@utils/meeting.utils';
import { ScheduleWithdrawRequest } from '@domain/schedule/dto/request/schedule.withdraw.request';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';

class MockScheduleService implements ScheduleService {
  async createSchedule(): Promise<string> {
    return 'OOOOOOO1';
  }
  async updateSchedule() {}
  async getSchedule(): Promise<ScheduleResponse> {
    return {
      name: 'schedule name',
      explanation: 'this is schedule',
      startDate: new Date(),
      endDate: null,
      announcement: 'moeasa',
      address: null,
      onlineYn: true,
    };
  }
  async getScheduleList(): Promise<ScheduleListResponse> {
    return {
      scheduleList: [],
      meetings: [],
    };
  }
  async withdraw() {}
  async delete() {}
}

describe('ScheduleController', () => {
  let scheduleController: ScheduleController;
  const scheduleId = 'OOOOOOO1';
  const user: AuthUser = {
    id: 1,
    name: 'yun',
    issueDate: Date.now(),
  };

  const scheduleRequest: ScheduleCreateRequest = {
    meeting_id: 'OOOOOOO1',
    name: 'schedule name',
    explanation: 'this is schedule',
    startDate: new Date(),
    endDate: null,
    reminder: [],
    announcement: 'moeasa',
    address: null,
    detailAddress: null,
    onlineYn: true,
    participants: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScheduleController],
      providers: [{ provide: 'ScheduleService', useClass: MockScheduleService }],
    }).compile();
    scheduleController = module.get<ScheduleController>(ScheduleController);
  });

  it('createScheduleTest', async () => {
    const req: ScheduleCreateRequest = {
      ...scheduleRequest,
    };

    const result = await scheduleController.createSchedule(req, user);
    expect(result).toStrictEqual(scheduleId);
  });

  it('updateScheduleTest', async () => {
    const req: ScheduleUpdateRequest = {
      ...scheduleRequest,
      schedule_id: MeetingUtils.transformMeetingIdToInteger(scheduleId),
    };
    const result = await scheduleController.updateSchedule(req, user);
    expect(result).toBe(void 0);
  });

  it('getScheduleTest', async () => {
    const scheduleId = 1;
    const result = await scheduleController.getSchedule(scheduleId);

    const response: ScheduleResponse = {
      name: 'schedule name',
      explanation: 'this is schedule',
      startDate: new Date(),
      endDate: null,
      announcement: 'moeasa',
      address: null,
      onlineYn: true,
    };
    expect(result).toStrictEqual(response);
  });

  it('getScheduleListTest', async () => {
    const result = await scheduleController.getScheduleList(user, [], OrderingOptionEnum.NAME);
    const response: ScheduleListResponse = {
      scheduleList: [],
      meetings: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('withdrawTest', async () => {
    const req: ScheduleWithdrawRequest = {
      meeting_id: 'OOOOOOO1',
      schedule_id: 1,
    };
    const result = await scheduleController.withdraw(req, user);
    expect(result).toBe(void 0);
  });

  it('deleteScheduleTest', async () => {
    const req: ScheduleWithdrawRequest = {
      meeting_id: 'OOOOOOO1',
      schedule_id: 1,
    };
    const result = await scheduleController.deleteSchedule(req, user);
    expect(result).toBe(void 0);
  });
});
