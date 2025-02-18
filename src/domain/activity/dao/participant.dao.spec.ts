import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDaoImpl } from '@domain/activity/dao/participant.dao';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';

class MockParticipantRepository extends Repository<Participant> {
  public static participants: Participant[] = [];
}

describe('participantDaoTest', () => {
  let participantDao: ParticipantDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ParticipantDao',
          useClass: ParticipantDaoImpl,
        },
        {
          provide: getRepositoryToken(Participant),
          useClass: MockParticipantRepository,
        },
      ],
    }).compile();
    participantDao = module.get<ParticipantDao>('ParticipantDao');
  });

  it('saveAll', async () => {
    const participants: Participant[] = [
      Participant.create({ activity_id: 1, users_id: 1 }),
      Participant.create({ activity_id: 1, users_id: 2 }),
    ];
    const result = await participantDao.saveAll(participants);
  });

  it('findByUserIdAndActivityleId', async () => {});

  it('findByActivityId', async () => {});

  it('findAllByUserId', async () => {});

  it('delete', async () => {});

  it('deleteAll', async () => {});
});
