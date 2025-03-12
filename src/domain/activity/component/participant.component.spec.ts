import { ParticipantDao } from '@root/domain/activity/dao/participant.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantComponentImpl } from '@domain/activity/component/participant.component';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

class MockParticipantDao implements ParticipantDao {
  public mockParticipants: Participant[] = [
    Participant.create({ userId: 10, activityId: 100 }),
    Participant.create({ userId: 10, activityId: 400 }),
    Participant.create({ userId: 30, activityId: 200 }),
    Participant.create({ userId: 20, activityId: 300 }),
    Participant.create({ userId: 50, activityId: 300 }),
  ];

  async saveAll(participants: Participant[]): Promise<void> {
    participants.forEach((participant: Participant) => {
      this.mockParticipants.push(participant);
    });
  }

  async findByUserIdAndActivityId(userId: number, activity_id: number): Promise<Participant | null> {
    return (
      this.mockParticipants.find(
        (participant: Participant) => participant.activityId === activity_id && participant.userId === userId,
      ) || null
    );
  }

  async findByActivityId(activity_id: number): Promise<Participant[]> {
    return this.mockParticipants.filter((participant: Participant) => participant.activityId === activity_id) || null;
  }

  async findAllByUserId(userId: number): Promise<Participant[] | null> {
    return this.mockParticipants.filter((participant: Participant) => participant.userId === userId);
  }

  async delete(usersId: number, activityId: number): Promise<void> {
    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) => !(participant.userId === usersId && participant.activityId === activityId),
    );
  }

  async deleteAll(usersIds: number[], activity_id: number): Promise<void> {
    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) => !(usersIds.includes(participant.userId) && participant.activityId === activity_id),
    );
  }

  async getParticipantCount(activityId: number): Promise<number> {
    return this.mockParticipants.filter((participant: Participant) => participant.activityId === activityId).length;
  }

  async getHomeActivityParticipants(): Promise<ActivityParticipantDto[]> {
    return;
  }
}

describe('ParticipantComponent', () => {
  let participantComponent: ParticipantComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ParticipantDao',
          useClass: MockParticipantDao,
        },
        {
          provide: 'ParticipantComponent',
          useClass: ParticipantComponentImpl,
        },
      ],
    }).compile();

    participantComponent = module.get<ParticipantComponent>('ParticipantComponent');
  });

  it('saveAllTest', async () => {
    const userId1 = 800;
    const activityId1 = 800;
    const userId2 = 900;
    const activityId2 = 900;
    const mockParticipants: Participant[] = [
      Participant.create({ userId: userId1, activityId: activityId1 }),
      Participant.create({ userId: userId2, activityId: activityId2 }),
    ];

    await participantComponent.saveAll(mockParticipants);

    const result1 = await participantComponent.findByUserIdAndActivityId(userId1, activityId1);
    const result2 = await participantComponent.findByUserIdAndActivityId(userId2, activityId2);

    expect(result1.activityId).toBe(activityId1);
    expect(result1.userId).toBe(userId1);
    expect(result2.activityId).toBe(activityId2);
    expect(result2.userId).toBe(userId2);
  });

  it('findByUserIdAndActivityIdTest', async () => {
    const userId = 10;
    const activityId = 100;
    const result = await participantComponent.findByUserIdAndActivityId(userId, activityId);

    expect(result.activityId).toBe(100);
    expect(result.userId).toBe(10);
  });

  it('findByActivityIdTest', async () => {
    const activityId = 300;
    const result = await participantComponent.findByActivityId(activityId);

    expect(result[0].activityId).toBe(activityId);
    expect(result[0].userId).toBe(20);
    expect(result[1].activityId).toBe(activityId);
    expect(result[1].userId).toBe(50);
  });

  it('findAllByUserIdTest', async () => {
    const userId = 10;
    const results = await participantComponent.findAllByUserId(userId);

    expect(results[0].activityId).toBe(100);
    expect(results[0].userId).toBe(10);
    expect(results[1].activityId).toBe(400);
    expect(results[1].userId).toBe(10);
  });

  it('deleteTest', async () => {
    const activityId = 300;
    const userId = 20;

    const beforeDelete = await participantComponent.findByUserIdAndActivityId(userId, activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.activityId).toBe(activityId);

    await participantComponent.delete(userId, activityId);

    const afterDelete = await participantComponent.findByUserIdAndActivityId(userId, activityId);
    expect(afterDelete).toBeNull();
  });

  it('deleteAllTest', async () => {
    const activityId = 300;
    const userIds = [20, 50];

    const beforeDelete = await participantComponent.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete[0].activityId).toBe(activityId);
    expect(beforeDelete[0].userId).toBe(userIds[0]);
    expect(beforeDelete[1].activityId).toBe(activityId);
    expect(beforeDelete[1].userId).toBe(userIds[1]);

    await participantComponent.deleteAll(userIds, activityId);

    const afterDelete = await participantComponent.findByActivityId(activityId);
    expect(afterDelete).toEqual([]);
  });
});
