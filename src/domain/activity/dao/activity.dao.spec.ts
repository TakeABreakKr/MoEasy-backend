import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ActivityDaoImpl } from '@domain/activity/dao/activity.dao';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';
import { Activity } from '@domain/activity/entity/activity.entity';
import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { Address } from '@domain/activity/entity/address.embedded';

class MockActivityRepository extends Repository<Activity> {
  private mockActivities: Activity[] = [
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

  async save(entities: Activity | Activity[]): Promise<Activity[]> {
    const toSave = Array.isArray(entities) ? entities : [entities];
    for (const entity of toSave) {
      const index = this.mockActivities.findIndex((activity) => activity.id === entity.id);
      if (index !== -1) {
        this.mockActivities[index] = entity;
      } else {
        this.mockActivities.push(entity);
      }
    }

    return toSave;
  }

  async delete(id: number): Promise<DeleteResult> {
    const initialLength = this.mockActivities.length;

    this.mockActivities = this.mockActivities.filter((activity) => {
      return activity.id !== id;
    });

    return {
      raw: {},
      affected: initialLength > this.mockActivities.length ? 1 : 0,
    };
  }

  async find(): Promise<Activity[]> {
    return this.mockActivities;
  }

  async findBy(where: FindOptionsWhere<Activity>): Promise<Activity[]> {
    if (where.id) {
      return this.mockActivities.filter((activity) => activity.id === where.id);
    }
    if (where.id instanceof FindOperator && Array.isArray(where.id.value)) {
      const ids = where.id.value;
      return this.mockActivities.filter((activity) => ids.includes(activity.id));
    }

    return [];
  }

  async findOneBy(where: FindOptionsWhere<Activity>): Promise<Activity | null> {
    const activity = this.mockActivities.find((activity) => {
      return activity.id === where.id;
    });

    return activity || null;
  }
}

describe('ActivityDao', () => {
  let activityDao: ActivityDao;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: 'ActivityDao', useClass: ActivityDaoImpl },
        { provide: getRepositoryToken(Activity), useClass: MockActivityRepository },
      ],
    }).compile();

    activityDao = module.get<ActivityDao>('ActivityDao');
  });

  it('findByActivityIdTest', async () => {
    const activityId = 100;
    const result = await activityDao.findByActivityId(activityId);

    expect(result.id).toBe(activityId);
    expect(result.name).toBe('moeasy1');
    expect(result.explanation).toBe('모임설명1');
    expect(result.announcement).toBe('공지사항1');
    expect(result.onlineYn).toBe(true);
    expect(result.address.address).toBe('address_test');
    expect(result.detailAddress).toBe('평택');
  });

  it('findAllByActivityIdsTest', async () => {
    const activityIds = [100, 200];
    const results = await activityDao.findAllByActivityIds(activityIds);

    expect(results[0].id).toBe(activityIds[0]);
    expect(results[0].meetingId).toBe(100);
    expect(results[0].name).toBe('moeasy1');
    expect(results[0].explanation).toBe('모임설명1');
    expect(results[0].detailAddress).toBe('평택');
    expect(results[0].announcement).toBe('공지사항1');
    expect(results[0].onlineYn).toBe(true);
    expect(results[0].address.address).toBe('address_test');

    expect(results[1].id).toBe(activityIds[1]);
    expect(results[1].meetingId).toBe(200);
    expect(results[1].name).toBe('moeasy2');
    expect(results[1].explanation).toBe('모임설명2');
    expect(results[1].detailAddress).toBe('수원');
    expect(results[1].announcement).toBe('공지사항2');
    expect(results[1].onlineYn).toBe(false);
    expect(results[1].address.address).toBe('address_test');
  });

  it('createTest', async () => {
    const createActivityDto: ActivityCreateVO = {
      meetingId: 'G400',
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
    const result = await activityDao.create(createActivityDto);

    expect(result.id).toBe(1024);
    expect(result.name).toBe('moeasy4');
    expect(result.explanation).toBe('모임설명4');
    expect(result.detailAddress).toBe('서울');
    expect(result.announcement).toBe('공지사항4');
    expect(result.onlineYn).toBe(true);
    expect(result.address.address).toBe('address_test');
  });

  it('updateTest', async () => {
    const activity = Activity.createForTest(100, {
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

    await activityDao.update(activity);
    const updatedActivity = await activityDao.findByActivityId(100);

    expect(updatedActivity.id).toBe(100);
    expect(updatedActivity.name).toBe('moeasy1 변경');
    expect(updatedActivity.explanation).toBe('모임설명1 변경');
    expect(updatedActivity.announcement).toBe('공지사항1 변경');
    expect(updatedActivity.onlineYn).toBe(false);
    expect(updatedActivity.address.address).toBe('address_test');
    expect(updatedActivity.detailAddress).toBe('평택에서 변경');
  });

  it('findByMeetingIdTest', async () => {
    const meetingId = 200;
    const results = await activityDao.findByMeetingId(meetingId);

    expect(results[0].meetingId).toBe(200);
    expect(results[0].name).toBe('moeasy2');
    expect(results[0].explanation).toBe('모임설명2');
    expect(results[0].detailAddress).toBe('수원');
    expect(results[0].announcement).toBe('공지사항2');
    expect(results[0].onlineYn).toBe(false);
    expect(results[0].address.address).toBe('address_test');
  });

  it('deleteTest', async () => {
    const activityId = 200;

    const beforeDelete = await activityDao.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.id).toBe(activityId);

    await activityDao.delete(activityId);

    const afterDelete = await activityDao.findByActivityId(activityId);
    expect(afterDelete).toBeNull();
  });
});
