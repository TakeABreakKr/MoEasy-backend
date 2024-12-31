import { ScheduleDaoImpl } from '@domain/schedule/dao/schedule.dao';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Schedule } from '@domain/schedule/entity/schedule.entity';

class MockScheduleRepository {
  async findOneBy() {}
  async findBy() {}
  async save() {}
  async delete() {}
}

describe('ScheduleDaoTest', async () => {
  let scheduleDao: ScheduleDaoImpl;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ScheduleDaoImpl, { provide: getRepositoryToken(Schedule), useClass: MockScheduleRepository }],
    }).compile();
    scheduleDao = module.get<ScheduleDaoImpl>(ScheduleDaoImpl);
  });

  it('findByScheduleId', async () => {});

  it('findAllByScheduleIds', async () => {});

  it('create', async () => {});

  it('update', async () => {});

  it('findByMeetingId', async () => {});

  it('delete', async () => {});
});
