import { ParticipantDao } from '@root/domain/activity/dao/participant.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantComponentImpl } from '@domain/activity/component/participant.component';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';

class MockParticipantDao implements ParticipantDao {
  public mockParticipants: Participant[] = [
    Participant.create({ users_id: 10, activity_id: 100 }),
    Participant.create({ users_id: 10, activity_id: 400 }),
    Participant.create({ users_id: 30, activity_id: 200 }),
    Participant.create({ users_id: 20, activity_id: 300 }),
    Participant.create({ users_id: 50, activity_id: 300 }),
  ];

  async saveAll(participants: Participant[]): Promise<void> {
    participants.forEach((participant: Participant) => {
      this.mockParticipants.push(participant);
    });
  }

  async findByUserIdAndActivityId(users_id: number, activity_id: number): Promise<Participant | null> {
    return (
      this.mockParticipants.find(
        (participant: Participant) => participant.activity_id === activity_id && participant.users_id === users_id,
      ) || null
    );
  }

  async findByActivityId(activity_id: number): Promise<Participant[]> {
    return this.mockParticipants.filter((participant: Participant) => participant.activity_id === activity_id) || null;
  }

  async findAllByUserId(users_id: number): Promise<Participant[] | null> {
    return this.mockParticipants.filter((participant: Participant) => participant.users_id === users_id);
  }

  async delete(usersId: number, activityId: number): Promise<void> {
    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) => !(participant.users_id === usersId && participant.activity_id === activityId),
    );
  }

  async deleteAll(usersIds: number[], activity_id: number): Promise<void> {
    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) =>
        !(usersIds.includes(participant.users_id) && participant.activity_id === activity_id),
    );
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
      Participant.create({ users_id: userId1, activity_id: activityId1 }),
      Participant.create({ users_id: userId2, activity_id: activityId2 }),
    ];

    await participantComponent.saveAll(mockParticipants);

    const result1 = await participantComponent.findByUserIdAndActivityId(userId1, activityId1);
    const result2 = await participantComponent.findByUserIdAndActivityId(userId2, activityId2);

    expect(result1.activity_id).toBe(activityId1);
    expect(result1.users_id).toBe(userId1);
    expect(result2.activity_id).toBe(activityId2);
    expect(result2.users_id).toBe(userId2);
  });

  it('findByUserIdAndActivityIdTest', async () => {
    const userId = 10;
    const activityId = 100;
    const result = await participantComponent.findByUserIdAndActivityId(userId, activityId);

    expect(result.activity_id).toBe(100);
    expect(result.users_id).toBe(10);
  });

  it('findByActivityIdTest', async () => {
    const activityId = 300;
    const result = await participantComponent.findByActivityId(activityId);

    expect(result[0].activity_id).toBe(activityId);
    expect(result[0].users_id).toBe(20);
    expect(result[1].activity_id).toBe(activityId);
    expect(result[1].users_id).toBe(50);
  });

  it('findAllByUserIdTest', async () => {
    const userId = 10;
    const results = await participantComponent.findAllByUserId(userId);

    expect(results[0].activity_id).toBe(100);
    expect(results[0].users_id).toBe(10);
    expect(results[1].activity_id).toBe(400);
    expect(results[1].users_id).toBe(10);
  });

  it('deleteTest', async () => {
    const activityId = 300;
    const userId = 20;

    const beforeDelete = await participantComponent.findByUserIdAndActivityId(userId, activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.activity_id).toBe(activityId);

    await participantComponent.delete(userId, activityId);

    const afterDelete = await participantComponent.findByUserIdAndActivityId(userId, activityId);
    expect(afterDelete).toBeNull();
  });

  it('deleteAllTest', async () => {
    const activityId = 300;
    const userIds = [20, 50];

    const beforeDelete = await participantComponent.findByActivityId(activityId);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete[0].activity_id).toBe(activityId);
    expect(beforeDelete[0].users_id).toBe(userIds[0]);
    expect(beforeDelete[1].activity_id).toBe(activityId);
    expect(beforeDelete[1].users_id).toBe(userIds[1]);

    await participantComponent.deleteAll(userIds, activityId);

    const afterDelete = await participantComponent.findByActivityId(activityId);
    expect(afterDelete).toEqual([]);
  });
});
