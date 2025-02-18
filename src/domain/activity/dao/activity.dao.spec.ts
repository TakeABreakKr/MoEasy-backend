import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ActivityDaoImpl } from '@domain/activity/dao/activity.dao';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';
import { Activity } from '@domain/activity/entity/activity.entity';

class MockActivityRepository {
  async findOneBy() {}
  async findBy() {}
  async save() {}
  async delete() {}
}

describe('ActivityDaoTest', async () => {
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

  it('findByActivityId', async () => {});

  it('findAllByActivityIds', async () => {});

  it('create', async () => {});

  it('update', async () => {});

  it('findByMeetingId', async () => {});

  it('delete', async () => {});
});
