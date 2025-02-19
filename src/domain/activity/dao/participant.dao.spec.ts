import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDaoImpl } from '@domain/activity/dao/participant.dao';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';

class MockParticipantRepository extends Repository<Participant> {
  public mockParticipants: Participant[] = [
    Participant.create({ users_id: 10, activity_id: 100 }),
    Participant.create({ users_id: 10, activity_id: 400 }),
    Participant.create({ users_id: 30, activity_id: 200 }),
    Participant.create({ users_id: 20, activity_id: 300 }),
    Participant.create({ users_id: 50, activity_id: 300 }),
  ];

  async save(entities: Participant | Participant[]): Promise<Participant[]> {
    const toSave = Array.isArray(entities) ? entities : [entities];
    for (const entity of toSave) {
      const index = this.mockParticipants.findIndex((participant) => participant.users_id === entity.users_id);
      if (index !== -1) {
        this.mockParticipants[index] = entity;
      } else {
        this.mockParticipants.push(entity);
      }
    }

    return toSave;
  }

  async delete(where: FindOptionsWhere<Participant>): Promise<DeleteResult> {
    const initialLength = this.mockParticipants.length;

    if (where.users_id && where.activity_id) {
      this.mockParticipants = this.mockParticipants.filter(
        (participant) => !(participant.users_id === where.users_id && participant.activity_id === where.activity_id),
      );
    }

    if (where.users_id instanceof FindOperator && where.activity_id) {
      if (Array.isArray(where.users_id.value)) {
        const userIds = where.users_id.value;
        this.mockParticipants = this.mockParticipants.filter(
          (participant) => !(userIds.includes(participant.users_id) && participant.activity_id === where.activity_id),
        );
      }
    }

    return {
      raw: {},
      affected: initialLength > this.mockParticipants.length ? 1 : 0,
    };
  }

  async find(): Promise<Participant[]> {
    return this.mockParticipants;
  }

  async findBy(where: FindOptionsWhere<Participant>): Promise<Participant[]> {
    if (where.users_id) {
      return this.mockParticipants.filter((participant) => participant.users_id === where.users_id);
    }

    if (where.activity_id) {
      return this.mockParticipants.filter((participant) => participant.activity_id === where.activity_id) || null;
    }

    return [];
  }

  async findOneBy(where: FindOptionsWhere<Participant>): Promise<Participant | null> {
    if (where.activity_id)
      return this.mockParticipants.find((participant) => participant.activity_id === where.activity_id) || null;

    if (where.users_id && where.activity_id)
      return (
        this.mockParticipants.find(
          (participant) => participant.users_id === where.users_id && participant.activity_id === where.activity_id,
        ) || null
      );

    return null;
  }
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

  it('saveAllTest', async () => {
    const userId1 = 900;
    const activityId1 = 900;
    const userId2 = 800;
    const activityId2 = 800;
    const mockParticipants: Participant[] = [
      Participant.create({ users_id: userId1, activity_id: activityId1 }),
      Participant.create({ users_id: userId2, activity_id: activityId2 }),
    ];

    await participantDao.saveAll(mockParticipants);

    const result1 = await participantDao.findByUserIdAndActivityId(userId1, activityId1);
    const result2 = await participantDao.findByUserIdAndActivityId(userId2, activityId2);

    expect(result1.activity_id).toBe(activityId1);
    expect(result1.users_id).toBe(userId1);
    expect(result2.activity_id).toBe(activityId2);
    expect(result2.users_id).toBe(userId2);
  });

  it('findByUserIdAndActivityIdTest', async () => {
    const userId = 10;
    const activityId = 100;
    const result = await participantDao.findByUserIdAndActivityId(userId, activityId);

    expect(result.activity_id).toBe(100);
    expect(result.users_id).toBe(10);
  });

  it('findByActivityIdTest', async () => {
    const activityId = 300;
    const result = await participantDao.findByActivityId(activityId);

    expect(result[0].activity_id).toBe(activityId);
    expect(result[0].users_id).toBe(20);
    expect(result[1].activity_id).toBe(activityId);
    expect(result[1].users_id).toBe(50);
  });

  it('findAllByUserIdTest', async () => {
    const userId = 10;
    const results = await participantDao.findAllByUserId(userId);

    expect(results[0].activity_id).toBe(100);
    expect(results[0].users_id).toBe(10);
    expect(results[1].activity_id).toBe(400);
    expect(results[1].users_id).toBe(10);
  });

  it('deleteTest', async () => {
    const activityId = 100;
    const userId = 10;

    const beforeDelete = await participantDao.findByUserIdAndActivityId(userId, activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.activity_id).toBe(activityId);

    await participantDao.delete(userId, activityId);

    const afterDelete = await participantDao.findByUserIdAndActivityId(userId, activityId);
    expect(afterDelete).toBeNull();
  });

  it('deleteAllTest', async () => {
    const activityId = 100;
    const userIds = [10, 30];

    const beforeDelete = await participantDao.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete[0].activity_id).toBe(activityId);

    await participantDao.deleteAll(userIds, activityId);

    const afterDelete = await participantDao.findByActivityId(activityId);
    expect(afterDelete).toEqual([]);
  });
});
