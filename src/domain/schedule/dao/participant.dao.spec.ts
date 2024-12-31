import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Participant } from '@domain/schedule/entity/participant.entity';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao';
import { Repository } from 'typeorm';

class MockParticipantRepository extends Repository<Participant> {
  public static participants: Participant[] = [];
  async save() {}
  async findOneBy() {}
  async findBy() {}
  async delete() {}
}

describe('participantDaoTest', () => {
  let participantDao: ParticipantDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ParticipantDao',
          useClass: ParticipantDao,
        },
        {
          provide: getRepositoryToken(Participant),
          useClass: MockParticipantRepository,
        },
      ],
    }).compile();
    participantDao = module.get<ParticipantDao>(ParticipantDao);
  });

  it('saveAll', async () => {
    const participants: Participant[] = [
      Participant.create({ schedule_id: 1, users_id: 1 }),
      Participant.create({ schedule_id: 1, users_id: 2 }),
    ];
    const result = await participantDao.saveAll(participants);
  });

  it('findByUserIdAndScheduleId', async () => {});

  it('findByScheduleId', async () => {});

  it('findAllByUserId', async () => {});

  it('delete', async () => {});

  it('deleteAll', async () => {});
});
