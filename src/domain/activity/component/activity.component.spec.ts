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
    }),
  ];

  async findByActivityId(activity_id: number): Promise<Activity | null> {
    return this.mockActivitys.find((activity: Activity) => activity.activity_id === activity_id) || null;
  }

  async findAllByActivityIds(activity_ids: number[]): Promise<Activity[]> {
    return this.mockActivitys.filter((activity: Activity) => activity_ids.includes(activity.activity_id));
  }

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    const activity = Activity.createForTest(101, activityCreateVO);
    this.mockActivitys.push(activity);

    return activity;
  }

  async update(activity: Activity): Promise<void> {
    const index = this.mockActivitys.findIndex((item) => item.activity_id === activity.activity_id);
    this.mockActivitys[index] = activity;
  }

  async findByMeetingId(meeting_id: number): Promise<Activity[]> {
    return this.mockActivitys.filter((activity: Activity) => activity.meeting_id === meeting_id);
  }

  async delete(activity_id: number): Promise<void> {
    this.mockActivitys = this.mockActivitys.filter((activity: Activity) => activity.activity_id !== activity_id);
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
    };
    const result = await activityComponent.create(createActivityDto);

    expect(result.meeting_id).toBe(201);
    expect(result.activity_id).toBe(101);
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

    expect(result.activity_id).toBe(100);
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
    });
    await activityComponent.update(activity);
    const updatedActivity = await activityComponent.findByActivityId(100);

    expect(updatedActivity.activity_id).toBe(100);
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

    expect(results[0].activity_id).toBe(100);
    expect(results[0].meeting_id).toBe(100);
    expect(results[0].name).toBe('moeasy1');
    expect(results[0].explanation).toBe('모임설명1');
    expect(results[0].announcement).toBe('공지사항1');
    expect(results[0].onlineYn).toBe(true);
    expect(results[0].address.address).toBe('address_test');
    expect(results[0].detailAddress).toBe('평택');

    expect(results[1].activity_id).toBe(200);
    expect(results[1].meeting_id).toBe(200);
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

    expect(results[0].activity_id).toBe(200);
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
    expect(beforeDelete.activity_id).toBe(activityId);

    await activityComponent.delete(activityId);

    const afterDelete = await activityComponent.findByActivityId(activityId);
    expect(afterDelete).toBeNull();
  });
});
