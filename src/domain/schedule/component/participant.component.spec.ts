import { Participant } from '@domain/schedule/entity/participant.entity';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantComponentImpl } from '@domain/schedule/component/participant.component';
import { ParticipantComponent } from '@domain/schedule/component/participant.component.interface';

const daoAccessLog: string[] = [];

class MockParticipantDao implements ParticipantDao {
  public static saveAllLog: string = 'NotificationDao.saveAll called';
  public static findByUserIdAndScheduleIdLog: string = 'NotificationDao.findByUserIdAndScheduleId called';
  public static findByScheduleIdLog: string = 'NotificationDao.findByScheduleId called';
  public static findAllByUserIdLog: string = 'NotificationDao.findAllByUserId called';
  public static deleteLog: string = 'NotificationDao.delete called';
  public static deleteAllLog: string = 'NotificationDao.deleteAll called';

  public static participants: Participant[] = [
    Participant.create({ users_id: 10, schedule_id: 200 }),
    Participant.create({ users_id: 30, schedule_id: 300 }),
    Participant.create({ users_id: 20, schedule_id: 300 }),
  ];

  public static getLength(): number {
    return this.participants.length;
  }

  async saveAll(participants: Participant[]): Promise<void> {
    participants.forEach((participant: Participant) => {
      MockParticipantDao.participants.push(participant);
    });
    daoAccessLog.push(MockParticipantDao.saveAllLog);
  }
  async findByUserIdAndScheduleId(user_id: number, schedule_id: number): Promise<Participant | null> {
    daoAccessLog.push(MockParticipantDao.findByUserIdAndScheduleIdLog);
    return MockParticipantDao.participants.find((participant: Participant) => {
      if (participant.schedule_id === schedule_id && participant.users_id === user_id) return participant;
    });
  }

  async findByScheduleId(schedule_id: number): Promise<Participant[] | null> {
    daoAccessLog.push(MockParticipantDao.findByScheduleIdLog);
    return MockParticipantDao.participants.filter((participant: Participant) => {
      if (participant.schedule_id === schedule_id) return participant;
    });
  }

  async findAllByUserId(user_id: number): Promise<Participant[] | null> {
    daoAccessLog.push(MockParticipantDao.findAllByUserIdLog);
    return MockParticipantDao.participants.filter((participant: Participant) => {
      if (participant.users_id === user_id) return participant;
    });
  }
  async delete(): Promise<void> {
    daoAccessLog.push(MockParticipantDao.deleteLog);
  }

  async deleteAll(): Promise<void> {
    daoAccessLog.push(MockParticipantDao.deleteAllLog);
  }
}

describe('ParticipantComponent', () => {
  let participantComponent: ParticipantComponent;

  beforeEach(async () => {
    daoAccessLog.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ParticipantDao',
          useClass: MockParticipantDao,
        },
        { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
      ],
    }).compile();
    participantComponent = module.get<ParticipantComponent>('ParticipantComponent');
  });

  it('saveAllTest', async () => {
    const participants: Participant[] = [
      Participant.create({ users_id: 10, schedule_id: 100 }),
      Participant.create({ users_id: 20, schedule_id: 100 }),
    ];
    const result = await participantComponent.saveAll(participants);
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockParticipantDao.saveAllLog]);
    expect(MockParticipantDao.getLength()).toBe(5);
  });

  it('findByUserIdAndScheduleIdTest', async () => {
    const response: Participant = Participant.create({ users_id: 10, schedule_id: 200 });
    const result = await participantComponent.findByUserIdAndScheduleId(10, 200);
    expect(result).toStrictEqual(response);
    expect(daoAccessLog).toEqual([MockParticipantDao.findByUserIdAndScheduleIdLog]);
  });

  it('findByScheduleIdTest', async () => {
    const result = await participantComponent.findByScheduleId(300);
    const response: Participant[] = [
      Participant.create({ users_id: 30, schedule_id: 300 }),
      Participant.create({ users_id: 20, schedule_id: 300 }),
    ];
    expect(result.length).toBe(2);
    expect(result).toStrictEqual(response);
    expect(daoAccessLog).toEqual([MockParticipantDao.findByScheduleIdLog]);
  });

  it('findAllByUserIdTest', async () => {
    const result = await participantComponent.findAllByUserId(20);
    const response = [
      Participant.create({ users_id: 20, schedule_id: 300 }),
      Participant.create({ users_id: 20, schedule_id: 100 }),
    ];
    expect(result).toStrictEqual(response);
    expect(daoAccessLog).toEqual([MockParticipantDao.findAllByUserIdLog]);
  });

  it('deleteTest', async () => {
    const result = await participantComponent.delete(10, 200);
    expect(result).toBe(void 0);
    expect(daoAccessLog).toEqual([MockParticipantDao.deleteLog]);
  });

  it('deleteAllTest', async () => {
    expect(await participantComponent.deleteAll([20, 30], 300)).toBe(void 0);
    expect(daoAccessLog).toEqual([MockParticipantDao.deleteAllLog]);
  });
});
