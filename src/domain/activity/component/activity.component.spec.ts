import { Test, TestingModule } from '@nestjs/testing';

import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityComponentImpl } from '@domain/activity/component/activity.component';

const daoAccessLog: string[] = [];
class MockActivityDao implements ActivityDao {
  static createLog: string = 'ActivityDao.create called';
  static findByActivityIdLog: string = 'ActivityDao.findByActivityId called';
  static updateLog: string = 'ActivityDao.update called';
  static findAllByActivityIdsLog: string = 'ActivityDao.findAllByActivityIds called';
  static findByMeetingIdLog: string = 'ActivityDao.findByMeetingId called';
  static deleteLog: string = 'ActivityDao.delete called';

  static activityCreateVOs: ActivityCreateVO[] = [
    {
      meetingId: '123',
      name: 'Jane',
      explanation: '모임2',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '',
      onlineYn: true,
      address: null,
      detailAddress: '강남',
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
      address: null,
      detailAddress: '강남',
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
      address: null,
      detailAddress: '강남',
    },
  ];

  public static activitys: Activity[] = [
    Activity.createForTest(100, MockActivityDao.activityCreateVOs[0]),
    Activity.createForTest(200, MockActivityDao.activityCreateVOs[1]),
    Activity.createForTest(300, MockActivityDao.activityCreateVOs[2]),
  ];

  async findByActivityId(activity_id: number): Promise<Activity | null> {
    daoAccessLog.push(MockActivityDao.findByActivityIdLog);
    return MockActivityDao.activitys.find((activity: Activity) => activity.activity_id === activity_id);
  }

  async findAllByActivityIds(activity_ids: number[]): Promise<Activity[]> {
    daoAccessLog.push(MockActivityDao.findAllByActivityIdsLog);
    return MockActivityDao.activitys.filter((activity: Activity) => activity_ids.includes(activity.activity_id));
  }

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    daoAccessLog.push(MockActivityDao.createLog);
    const activity = Activity.createForTest(101, activityCreateVO);
    MockActivityDao.activitys.push(activity);
    return activity;
  }

  async update(activity: Activity): Promise<void> {
    daoAccessLog.push(MockActivityDao.updateLog);
    MockActivityDao.activitys.push(activity);
  }

  async findByMeetingId(meeting_id: number): Promise<Activity[]> {
    daoAccessLog.push(MockActivityDao.findByMeetingIdLog);
    return MockActivityDao.activitys.filter((activity: Activity) => activity.meeting_id === meeting_id);
  }

  async delete(activity_id: number): Promise<void> {
    daoAccessLog.push(MockActivityDao.deleteLog);
    MockActivityDao.activitys = MockActivityDao.activitys.filter(
      (activity: Activity) => activity.activity_id !== activity_id,
    );
  }
}

describe('ActivityComponent', () => {
  let activityComponent: ActivityComponent;

  beforeEach(async () => {
    daoAccessLog.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ActivityDao', useClass: MockActivityDao },
        { provide: 'ActivityComponent', useClass: ActivityComponentImpl },
      ],
    }).compile();

    activityComponent = module.get<ActivityComponent>('ActivityComponent');
  });

  const activity1: ActivityCreateVO = {
    meetingId: '123',
    name: 'John',
    explanation: '모임',
    startDate: new Date(),
    endDate: new Date(),
    reminder: [],
    announcement: '',
    onlineYn: true,
    address: null,
    detailAddress: '강남',
  };

  it('createTest', async () => {
    const result = await activityComponent.create(activity1);
    expect(result).toStrictEqual(Activity.createForTest(101, activity1));
    expect(daoAccessLog).toEqual([MockActivityDao.createLog]);
    expect(MockActivityDao.activitys.length).toBe(4);
  });

  it('findByActivityIdTest', async () => {
    const result = await activityComponent.findByActivityId(100);
    expect(result).toStrictEqual(MockActivityDao.activitys[0]);
    expect(daoAccessLog).toEqual([MockActivityDao.findByActivityIdLog]);
  });

  it('updateTest', async () => {
    const result = await activityComponent.update(Activity.createForTest(101, activity1));
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockActivityDao.updateLog]);
  });

  it('findAllByActivityIdsTest', async () => {
    const activityIds: number[] = [100, 300];
    const result = await activityComponent.findAllByActivityIds(activityIds);
    expect(result).toStrictEqual([MockActivityDao.activitys[0], MockActivityDao.activitys[2]]);
    expect(daoAccessLog).toEqual([MockActivityDao.findAllByActivityIdsLog]);
    expect(result.length).toBe(2);
  });

  it('findByMeetingIdTest', async () => {
    const result = await activityComponent.findByMeetingId(564);
    expect(result).toStrictEqual([MockActivityDao.activitys[1], MockActivityDao.activitys[2]]);
    expect(result.length).toBe(2);
    expect(daoAccessLog).toEqual([MockActivityDao.findByMeetingIdLog]);
  });

  it('deleteTest', async () => {
    const result = await activityComponent.delete(300);
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockActivityDao.deleteLog]);
    expect(MockActivityDao.activitys.length).toBe(4);
  });
});
