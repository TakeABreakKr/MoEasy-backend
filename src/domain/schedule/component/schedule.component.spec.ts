import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';
import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleComponentImpl } from '@domain/schedule/component/schedule.component';
import { ScheduleComponent } from '@domain/schedule/component/schedule.component.interface';
import { ScheduleComponent } from '@domain/schedule/dao/schedule.dao.interface';

const daoAccessLog: string[] = [];
class MockScheduleDao implements ScheduleComponent {
  static createLog: string = 'ScheduleDao.create called';
  static findByScheduleIdLog: string = 'ScheduleDao.findByScheduleId called';
  static updateLog: string = 'ScheduleDao.update called';
  static findAllByScheduleIdsLog: string = 'ScheduleDao.findAllByScheduleIds called';
  static findByMeetingIdLog: string = 'ScheduleDao.findByMeetingId called';
  static deleteLog: string = 'ScheduleDao.delete called';

  static scheduleCreateVOs: ScheduleCreateVO[] = [
    {
      meetingId: '123',
      name: 'Jane',
      explanation: '모임2',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '',
      onlineYn: true,
    },
    {
      meetingId: '234',
      name: '정기모임1',
      explanation: '강남',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '',
      onlineYn: false,
    },
    {
      meetingId: '234',
      name: '정기모임2',
      explanation: '또 강남',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '',
      onlineYn: false,
    },
  ];

  public static schedules: Schedule[] = [
    Schedule.createForTest(100, MockScheduleDao.scheduleCreateVOs[0]),
    Schedule.createForTest(200, MockScheduleDao.scheduleCreateVOs[1]),
    Schedule.createForTest(300, MockScheduleDao.scheduleCreateVOs[2]),
  ];

  async findByScheduleId(schedule_id: number): Promise<Schedule | null> {
    daoAccessLog.push(MockScheduleDao.findByScheduleIdLog);
    return MockScheduleDao.schedules.find((schedule: Schedule) => schedule.schedule_id === schedule_id);
  }

  async findAllByScheduleIds(schedule_ids: number[]): Promise<Schedule[]> {
    daoAccessLog.push(MockScheduleDao.findAllByScheduleIdsLog);
    return MockScheduleDao.schedules.filter((schedule: Schedule) => schedule_ids.includes(schedule.schedule_id));
  }

  async create(scheduleCreateVO: ScheduleCreateVO): Promise<Schedule> {
    daoAccessLog.push(MockScheduleDao.createLog);
    const schedule = Schedule.createForTest(101, scheduleCreateVO);
    MockScheduleDao.schedules.push(schedule);
    return schedule;
  }

  async update(schedule: Schedule): Promise<void> {
    daoAccessLog.push(MockScheduleDao.updateLog);
    MockScheduleDao.schedules.push(schedule);
  }

  async findByMeetingId(meeting_id: number): Promise<Schedule[]> {
    daoAccessLog.push(MockScheduleDao.findByMeetingIdLog);
    return MockScheduleDao.schedules.filter((schedule: Schedule) => schedule.meeting_id === meeting_id);
  }

  async delete(schedule_id: number): Promise<void> {
    daoAccessLog.push(MockScheduleDao.deleteLog);
    MockScheduleDao.schedules = MockScheduleDao.schedules.filter(
      (schedule: Schedule) => schedule.schedule_id !== schedule_id,
    );
  }
}

describe('ScheduleComponent', () => {
  let scheduleComponent: ScheduleComponent;

  beforeEach(async () => {
    daoAccessLog.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ScheduleDao', useClass: MockScheduleDao },
        { provide: 'ScheduleComponent', useClass: ScheduleComponentImpl },
      ],
    }).compile();

    scheduleComponent = module.get<ScheduleComponent>('ScheduleComponent');
  });

  const schedule1: ScheduleCreateVO = {
    meetingId: '123',
    name: 'John',
    explanation: '모임',
    startDate: new Date(),
    endDate: new Date(),
    reminder: [],
    announcement: '',
    onlineYn: true,
  };

  it('createTest', async () => {
    const result = await scheduleComponent.create(schedule1);
    expect(result).toStrictEqual(Schedule.createForTest(101, schedule1));
    expect(daoAccessLog).toEqual([MockScheduleDao.createLog]);
    expect(MockScheduleDao.schedules.length).toBe(4);
  });

  it('findByScheduleIdTest', async () => {
    const result = await scheduleComponent.findByScheduleId(100);
    expect(result).toStrictEqual(MockScheduleDao.schedules[0]);
    expect(daoAccessLog).toEqual([MockScheduleDao.findByScheduleIdLog]);
  });

  it('updateTest', async () => {
    const result = await scheduleComponent.update(Schedule.createForTest(101, schedule1));
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockScheduleDao.updateLog]);
  });

  it('findAllByScheduleIdsTest', async () => {
    const scheduleIds: number[] = [100, 300];
    const result = await scheduleComponent.findAllByScheduleIds(scheduleIds);
    expect(result).toStrictEqual([MockScheduleDao.schedules[0], MockScheduleDao.schedules[2]]);
    expect(daoAccessLog).toEqual([MockScheduleDao.findAllByScheduleIdsLog]);
    expect(result.length).toBe(2);
  });

  it('findByMeetingIdTest', async () => {
    const result = await scheduleComponent.findByMeetingId(564);
    expect(result).toStrictEqual([MockScheduleDao.schedules[1], MockScheduleDao.schedules[2]]);
    expect(result.length).toBe(2);
    expect(daoAccessLog).toEqual([MockScheduleDao.findByMeetingIdLog]);
  });

  it('deleteTest', async () => {
    const result = await scheduleComponent.delete(300);
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockScheduleDao.deleteLog]);
    expect(MockScheduleDao.schedules.length).toBe(4);
  });
});
