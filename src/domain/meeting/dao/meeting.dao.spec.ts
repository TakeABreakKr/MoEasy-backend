import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDaoImpl } from './meeting.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MeetingDao } from './meeting.dao.interface';
import { MeetingCategoryEnum } from '@enums/meeting.category.enum';
import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';

class MockMeetingRepository extends Repository<Meeting> {
  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meetingId: 50,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 5,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: true,
      category: MeetingCategoryEnum.PET,
      publicYn: true,
    }),
    Meeting.createForTest({
      meetingId: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 7,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
      category: MeetingCategoryEnum.PET,
      publicYn: true,
    }),
  ];

  async save(entities: Meeting | Meeting[]): Promise<Meeting[]> {
    const toSave = Array.isArray(entities) ? entities : [entities];
    for (const entity of toSave) {
      const index = this.mockMeetings.findIndex((meeting) => meeting.id === entity.id);
      if (index !== -1) {
        this.mockMeetings[index] = entity;
      } else {
        this.mockMeetings.push(entity);
      }
    }
    return toSave;
  }

  async delete(id: number): Promise<DeleteResult> {
    const initialLength = this.mockMeetings.length;

    this.mockMeetings = this.mockMeetings.filter((meeting) => {
      return meeting.id !== id;
    });

    return {
      raw: {},
      affected: initialLength > this.mockMeetings.length ? 1 : 0,
    };
  }

  async find(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async findBy(where: FindOptionsWhere<Meeting>): Promise<Meeting[]> {
    if (where.id instanceof FindOperator && Array.isArray(where.id.value)) {
      const ids = where.id.value;
      return this.mockMeetings.filter((meeting) => ids.includes(meeting.id));
    }
    return [];
  }

  async findOneBy(where: FindOptionsWhere<Meeting>): Promise<Meeting | null> {
    const meeting = this.mockMeetings.find((meeting) => {
      return meeting.id === where.id;
    });

    return meeting || null;
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

    expect(result.id).toBe(meetingId);
    expect(result.name).toBe('모임 이름1');
    expect(result.limit).toBe(5);
    expect(result.thumbnail).toBe('testThumbnail1.jpg');
    expect(result.canJoin).toBe(true);
  });

  it('findByMeetingIdsTest', async () => {
    const meetingIds = [50, 200];

    const results = await meetingDao.findByMeetingIds(meetingIds);

    expect(results.length).toBe(2);
    expect(results[0].id).toBe(50);
    expect(results[0].limit).toBe(5);
    expect(results[0].thumbnail).toBe('testThumbnail1.jpg');
    expect(results[0].canJoin).toBe(true);

    expect(results[1].id).toBe(200);
    expect(results[1].limit).toBe(7);
    expect(results[1].thumbnail).toBe('testThumbnail2.jpg');
    expect(results[1].canJoin).toBe(true);
    expect(results.find((meeting) => meeting.id === 500)).toBeUndefined();
  });

  it('createTest', async () => {
    const createMeetingDto: CreateMeetingDto = {
      name: '테스트 모임',
      explanation: '모임 설명',
      limit: 5,
      thumbnail: 'createThumbnai.jpg',
      canJoin: true,
      category: MeetingCategoryEnum.PET,
      publicYn: true,
    };
    const result = await meetingDao.create(createMeetingDto);

    expect(result.name).toBe('테스트 모임');
    expect(result.explanation).toBe('모임 설명');
    expect(result.limit).toBe(5);
    expect(result.thumbnail).toBe('createThumbnai.jpg');
    expect(result.canJoin).toBe(true);
  });

  it('updateTest', async () => {
    const meeting = Meeting.createForTest({
      meetingId: 50,
      name: '업데이트한 모임이름',
      explanation: '업데이트한 모임설명',
      limit: 9,
      thumbnail: 'updateTestThumbnail.jpg',
      canJoin: false,
      category: MeetingCategoryEnum.PET,
      publicYn: true,
    });

    await meetingDao.update(meeting);

    const updatedMeeting = await meetingDao.findByMeetingId(50);

    expect(updatedMeeting.name).toBe('업데이트한 모임이름');
    expect(updatedMeeting.limit).toBe(9);
    expect(updatedMeeting.thumbnail).toBe('updateTestThumbnail.jpg');
    expect(updatedMeeting.canJoin).toBe(false);
  });

  it('findAllTest', async () => {
    const results = await meetingDao.findAll();

    expect(results.length).toBe(2);
    expect(results[0].name).toBe('모임 이름1');
    expect(results[0].explanation).toBe('모임 설명1');
    expect(results[0].limit).toBe(5);
    expect(results[0].thumbnail).toBe('testThumbnail1.jpg');

    expect(results[1].name).toBe('모임 이름2');
    expect(results[1].explanation).toBe('모임 설명2');
    expect(results[1].limit).toBe(7);
    expect(results[1].thumbnail).toBe('testThumbnail2.jpg');
  });

  it('deleteTest', async () => {
    const idToDelete = 200;

    const beforeDelete = await meetingDao.findByMeetingId(idToDelete);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.id).toBe(idToDelete);

    await meetingDao.delete(idToDelete);

    const afterDelete = await meetingDao.findByMeetingId(idToDelete);
    expect(afterDelete).toBeNull();
  });
});
