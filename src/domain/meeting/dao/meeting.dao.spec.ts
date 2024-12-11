import { DeepPartial, DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDaoImpl } from './meeting.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeetingDao } from './meeting.dao.interface';

class MockMeetingRepository extends Repository<Meeting> {
  private meetings: Partial<Meeting>[] = [
    {
      meeting_id: 50,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 5,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: true,
    },
    {
      meeting_id: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 7,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
    },
  ];

  async save(meeting: any): Promise<any> {
    return meeting;
  }

  create(): Meeting;
  create(entityLike: DeepPartial<Meeting>): Meeting;
  create(entityLike: DeepPartial<Meeting>[]): Meeting[];
  create(entityLike?: any): Meeting | Meeting[] {
    if (!entityLike) return new Meeting();
    const meeting = new Meeting();

    return Object.assign(meeting, entityLike);
  }

  async delete(id: number): Promise<DeleteResult> {
    const initialLength = this.meetings.length;
    this.meetings = this.meetings.filter((m) => m.meeting_id !== id);

    return {
      raw: {},
      affected: this.meetings.length < initialLength ? 1 : 0,
    };
  }

  async find(): Promise<Meeting[]> {
    return this.meetings as Meeting[];
  }

  async findBy(where: FindOptionsWhere<Meeting>): Promise<Meeting[]> {
    if (where.meeting_id instanceof FindOperator) {
      const ids = where.meeting_id.value as unknown as number[];

      return this.meetings.filter((m) => ids.includes(m.meeting_id)) as Meeting[];
    }

    return [];
  }

  async findOneBy(where: { meeting_id: number }): Promise<Meeting | null> {
    const meeting = this.meetings.find((m) => m.meeting_id === where.meeting_id);

    return (meeting as Meeting) || null;
  }
}

describe('MeetingDao', () => {
  let meetingDao: MeetingDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MeetingDao', useClass: MeetingDaoImpl },
        { provide: getRepositoryToken(Meeting), useClass: MockMeetingRepository },
      ],
    }).compile();
    meetingDao = module.get<MeetingDao>('MeetingDao');
  });

  it('findByMeetingIdTest', async () => {
    const meetingId = 50;

    const result = await meetingDao.findByMeetingId(meetingId);

    expect(result?.meeting_id).toBe(meetingId);
    expect(result?.name).toBe('모임 이름1');
  });

  it('findByMeetingIdsTest', async () => {
    const meetingIds = [50, 200];

    const results = await meetingDao.findByMeetingIds(meetingIds);

    expect(results.length).toBe(2);
    expect(results[0].meeting_id).toBe(50);
    expect(results[0].limit).toBe(5);
    expect(results[1].meeting_id).toBe(200);
    expect(results[1].limit).toBe(7);
    expect(results.find((meeting) => meeting.meeting_id === 500)).toBeUndefined();
  });

  it('createTest', async () => {
    const props = {
      name: '테스트 모임',
      explanation: '모임 설명',
      limit: 5,
      thumbnail: 'createThumbnai.jpg',
      canJoin: true,
    };
    const result = await meetingDao.create(props);

    expect(result.name).toBe('테스트 모임');
    expect(result.explanation).toBe('모임 설명');
    expect(result.limit).toBe(5);
    expect(result.thumbnail).toBe('createThumbnai.jpg');
    expect(result.canJoin).toBe(true);
  });

  it('updateTest', async () => {
    const meeting = new Meeting();
    meeting.meeting_id = 1;
    meeting.name = '테스트 모임';
    meeting.explanation = '모임 설명';
    meeting.limit = 5;
    meeting.thumbnail = 'updateThumbnail.jpg';
    meeting.canJoin = true;

    meeting.name = '업데이트한 모임이름';

    await meetingDao.update(meeting);

    expect(meeting.name).toBe('업데이트한 모임이름');
    expect(meeting.limit).toBe(5);
  });

  it('findAllTest', async () => {
    const results = await meetingDao.findAll();

    expect(results.length).toBe(2);
    expect(results[0].name).toBe('모임 이름1');
    expect(results[0].explanation).toBe('모임 설명1');
    expect(results[1].name).toBe('모임 이름2');
    expect(results[1].explanation).toBe('모임 설명2');
  });

  it('deleteTest', async () => {
    const idToDelete = 200;

    const beforeDelete = await meetingDao.findByMeetingId(idToDelete);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete?.meeting_id).toBe(idToDelete);

    await meetingDao.delete(idToDelete);

    const afterDelete = await meetingDao.findByMeetingId(idToDelete);
    expect(afterDelete).toBeNull();
  });
});
