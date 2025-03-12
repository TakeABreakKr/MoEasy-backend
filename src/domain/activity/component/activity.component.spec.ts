import { Test, TestingModule } from '@nestjs/testing';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityComponentImpl } from '@domain/activity/component/activity.component';
import { Address } from '@domain/activity/entity/address.embedded';

class MockActivityDao implements ActivityDao {
  public mockActivitys: Activity[] = [
    Activity.createForTest(100, {
      meetingId: '64',
      name: 'moeasy1',
      explanation: '모임설명1',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항1',
      onlineYn: true,
      address: Address.createForTest(),
      detailAddress: '평택',
      participantLimit: 10,
    }),
    Activity.createForTest(200, {
      meetingId: 'C8',
      name: 'moeasy2',
      explanation: '모임설명2',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항2',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '수원',
      participantLimit: 10,
    }),
  ];

  async findByActivityId(activityId: number): Promise<Activity | null> {
    return this.mockActivitys.find((activity: Activity) => activity.id === activityId) || null;
  }

  async findAllByActivityIds(activity_ids: number[]): Promise<Activity[]> {
    return this.mockActivitys.filter((activity: Activity) => activity_ids.includes(activity.id));
  }

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    const activity = Activity.createForTest(101, activityCreateVO);
    this.mockActivitys.push(activity);

    return activity;
  }

  async update(activity: Activity): Promise<void> {
    const index = this.mockActivitys.findIndex((item) => item.id === activity.id);
    this.mockActivitys[index] = activity;
  }

  async findByMeetingId(meetingId: number): Promise<Activity[]> {
    return this.mockActivitys.filter((activity: Activity) => activity.meetingId === meetingId);
  }

  async delete(activityId: number): Promise<void> {
    this.mockActivitys = this.mockActivitys.filter((activity: Activity) => activity.id !== activityId);
  }

  async getClosingTimeActivities(): Promise<Partial<Activity>[]> {
    return [];
  }

  async getUpcomingActivities(): Promise<Activity[]> {
    return [];
  }
}

describe('ActivityComponent', () => {
  let activityComponent: ActivityComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ActivityDao',
          useClass: MockActivityDao,
        },
        {
          provide: 'ActivityComponent',
          useClass: ActivityComponentImpl,
        },
      ],
    }).compile();

    activityComponent = module.get<ActivityComponent>('ActivityComponent');
  });

  it('createTest', async () => {
    const createActivityDto: ActivityCreateVO = {
      meetingId: 'C9',
      name: 'moeasy4',
      explanation: '모임설명4',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항4',
      onlineYn: true,
      address: Address.createForTest(),
      detailAddress: '서울',
      participantLimit: 10,
    };
    const result = await activityComponent.create(createActivityDto);

    expect(result.meetingId).toBe(201);
    expect(result.id).toBe(101);
    expect(result.name).toBe('moeasy4');
    expect(result.explanation).toBe('모임설명4');
    expect(result.announcement).toBe('공지사항4');
    expect(result.onlineYn).toBe(true);
    expect(result.address.address).toBe('address_test');
    expect(result.detailAddress).toBe('서울');
  });

  it('findByActivityIdTest', async () => {
    const activityId = 100;
    const result = await activityComponent.findByActivityId(activityId);

    expect(result.id).toBe(100);
    expect(result.name).toBe('moeasy1');
    expect(result.explanation).toBe('모임설명1');
    expect(result.announcement).toBe('공지사항1');
    expect(result.onlineYn).toBe(true);
    expect(result.address.address).toBe('address_test');
    expect(result.detailAddress).toBe('평택');
  });

  it('updateTest', async () => {
    const activityId = 100;
    const activity = Activity.createForTest(activityId, {
      meetingId: '100',
      name: 'moeasy1 변경',
      explanation: '모임설명1 변경',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항1 변경',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '평택에서 변경',
      participantLimit: 10,
    });
    await activityComponent.update(activity);
    const updatedActivity = await activityComponent.findByActivityId(100);

    expect(updatedActivity.id).toBe(100);
    expect(updatedActivity.name).toBe('moeasy1 변경');
    expect(updatedActivity.explanation).toBe('모임설명1 변경');
    expect(updatedActivity.announcement).toBe('공지사항1 변경');
    expect(updatedActivity.onlineYn).toBe(false);
    expect(updatedActivity.address.address).toBe('address_test');
    expect(updatedActivity.detailAddress).toBe('평택에서 변경');
  });

  it('findAllByActivityIdsTest', async () => {
    const activityIds: number[] = [100, 200];
    const results = await activityComponent.findAllByActivityIds(activityIds);

    expect(results[0].id).toBe(100);
    expect(results[0].meetingId).toBe(100);
    expect(results[0].name).toBe('moeasy1');
    expect(results[0].explanation).toBe('모임설명1');
    expect(results[0].announcement).toBe('공지사항1');
    expect(results[0].onlineYn).toBe(true);
    expect(results[0].address.address).toBe('address_test');
    expect(results[0].detailAddress).toBe('평택');

    expect(results[1].id).toBe(200);
    expect(results[1].meetingId).toBe(200);
    expect(results[1].name).toBe('moeasy2');
    expect(results[1].explanation).toBe('모임설명2');
    expect(results[1].announcement).toBe('공지사항2');
    expect(results[1].onlineYn).toBe(false);
    expect(results[1].address.address).toBe('address_test');
    expect(results[1].detailAddress).toBe('수원');
  });

  it('findByMeetingIdTest', async () => {
    const meetingId = 200;
    const results = await activityComponent.findByMeetingId(meetingId);

    expect(results[0].id).toBe(200);
    expect(results[0].name).toBe('moeasy2');
    expect(results[0].explanation).toBe('모임설명2');
    expect(results[0].announcement).toBe('공지사항2');
    expect(results[0].onlineYn).toBe(false);
    expect(results[0].address.address).toBe('address_test');
    expect(results[0].detailAddress).toBe('수원');
  });

  it('deleteTest', async () => {
    const activityId = 200;

    const beforeDelete = await activityComponent.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.id).toBe(activityId);

    await activityComponent.delete(activityId);

    const afterDelete = await activityComponent.findByActivityId(activityId);
    expect(afterDelete).toBeNull();
  });
});
