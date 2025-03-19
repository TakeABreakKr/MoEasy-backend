import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDaoImpl } from '@domain/activity/dao/participant.dao';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';

class MockParticipantRepository extends Repository<Participant> {
  public mockParticipants: Participant[] = [
    Participant.create({ userId: 10, activityId: 100 }),
    Participant.create({ userId: 10, activityId: 400 }),
    Participant.create({ userId: 30, activityId: 200 }),
    Participant.create({ userId: 20, activityId: 300 }),
    Participant.create({ userId: 50, activityId: 300 }),
  ];

  async save(entities: Participant | Participant[]): Promise<Participant[]> {
    const toSave = Array.isArray(entities) ? entities : [entities];
    for (const entity of toSave) {
      const index = this.mockParticipants.findIndex(
        (participant) => participant.userId === entity.userId && participant.activityId === entity.activityId,
      );

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

    if (where.userId && where.activityId) {
      this.mockParticipants = this.mockParticipants.filter(
        (participant) => !(participant.userId === where.userId && participant.activityId === where.activityId),
      );
    }

    if (where.userId instanceof FindOperator && where.activityId) {
      if (Array.isArray(where.userId.value)) {
        const userIds = where.userId.value;
        this.mockParticipants = this.mockParticipants.filter(
          (participant) => !(userIds.includes(participant.userId) && participant.activityId === where.activityId),
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
    if (where.userId) {
      return this.mockParticipants.filter((participant) => participant.userId === where.userId);
    }

    if (where.activityId) {
      return this.mockParticipants.filter((participant) => participant.activityId === where.activityId);
    }

    return [];
  }

  async findOneBy(where: FindOptionsWhere<Participant>): Promise<Participant | null> {
    if (where.userId && where.activityId)
      return (
        this.mockParticipants.find(
          (participant) => participant.userId === where.userId && participant.activityId === where.activityId,
        ) || null
      );

    if (where.activityId)
      return this.mockParticipants.find((participant) => participant.activityId === where.activityId) || null;

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
      Participant.create({ userId: userId1, activityId: activityId1 }),
      Participant.create({ userId: userId2, activityId: activityId2 }),
    ];

    await participantDao.saveAll(mockParticipants);

    const result1 = await participantDao.findByUserIdAndActivityId(userId1, activityId1);
    const result2 = await participantDao.findByUserIdAndActivityId(userId2, activityId2);

    expect(result1.activityId).toBe(activityId1);
    expect(result1.userId).toBe(userId1);
    expect(result2.activityId).toBe(activityId2);
    expect(result2.userId).toBe(userId2);
  });

  it('findByUserIdAndActivityIdTest', async () => {
    const userId = 10;
    const activityId = 100;
    const result = await participantDao.findByUserIdAndActivityId(userId, activityId);

    expect(result.activityId).toBe(100);
    expect(result.userId).toBe(10);
  });

  it('findByActivityIdTest', async () => {
    const activityId = 300;
    const result = await participantDao.findByActivityId(activityId);

    expect(result[0].activityId).toBe(activityId);
    expect(result[0].userId).toBe(20);
    expect(result[1].activityId).toBe(activityId);
    expect(result[1].userId).toBe(50);
  });

  it('findAllByUserIdTest', async () => {
    const userId = 10;
    const results = await participantDao.findAllByUserId(userId);

    expect(results[0].activityId).toBe(100);
    expect(results[0].userId).toBe(10);
    expect(results[1].activityId).toBe(400);
    expect(results[1].userId).toBe(10);
  });

  it('deleteTest', async () => {
    const activityId = 100;
    const userId = 10;

    const beforeDelete = await participantDao.findByUserIdAndActivityId(userId, activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.activityId).toBe(activityId);

    await participantDao.delete(userId, activityId);

    const afterDelete = await participantDao.findByUserIdAndActivityId(userId, activityId);
    expect(afterDelete).toBeNull();
  });

  it('deleteAllTest', async () => {
    const activityId = 100;
    const userIds = [10, 30];

    const beforeDelete = await participantDao.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete[0].activityId).toBe(activityId);

    await participantDao.deleteAll(userIds, activityId);

    const afterDelete = await participantDao.findByActivityId(activityId);
    expect(afterDelete).toEqual([]);
  });
});
