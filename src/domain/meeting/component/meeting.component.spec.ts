import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { MeetingComponent } from './meeting.component.interface';
import { MeetingComponentImpl } from './meeting.component';
import { Meeting } from '../entity/meeting.entity';
import { CreateMeetingDto } from '../dto/create.meeting.dto';

class MockMeetingDao implements MeetingDao {
  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meeting_id: 50,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 5,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: true,
    }),
    Meeting.createForTest({
      meeting_id: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 7,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    return this.mockMeetings.find((meeting) => meeting.meeting_id === id) || null;
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    return this.mockMeetings.filter((meeting) => ids.includes(meeting.meeting_id));
  }

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    const meeting = Meeting.createForTest({ ...createMeetingDto, meeting_id: 80 });
    this.mockMeetings.push(meeting);

    return meeting;
  }

  async update(meeting: Meeting): Promise<void> {
    const index = this.mockMeetings.findIndex((meeting) => meeting.meeting_id === meeting.meeting_id);
    this.mockMeetings[index] = meeting;
  }

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(id: number): Promise<void> {
    this.mockMeetings = this.mockMeetings.filter((meeting) => meeting.meeting_id !== id);
  }
}

describe('MeetingComponent', () => {
  let meetingComponent: MeetingComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MeetingDao',
          useClass: MockMeetingDao,
        },
        {
          provide: 'MeetingComponent',
          useClass: MeetingComponentImpl,
        },
      ],
    }).compile();
    meetingComponent = module.get<MeetingComponent>('MeetingComponent');
  });

  it('findByMeetingIdTest ', async () => {
    const meetingId = 50;

    const result = await meetingComponent.findByMeetingId(meetingId);

    expect(result.meeting_id).toBe(50);
    expect(result.name).toBe('모임 이름1');
    expect(result.limit).toBe(5);
    expect(result.thumbnail).toBe('testThumbnail1.jpg');
    expect(result.canJoin).toBe(true);
  });

  it('findByMeetingIdsTest', async () => {
    const meetingIds = [50, 200];

    const result = await meetingComponent.findByMeetingIds(meetingIds);

    expect(result[0].meeting_id).toBe(50);
    expect(result[0].limit).toBe(5);
    expect(result[0].thumbnail).toBe('testThumbnail1.jpg');
    expect(result[0].canJoin).toBe(true);

    expect(result[1].meeting_id).toBe(200);
    expect(result[1].limit).toBe(7);
    expect(result[1].thumbnail).toBe('testThumbnail2.jpg');
    expect(result[1].canJoin).toBe(true);
  });

  it('createTest', async () => {
    const createMeetingDto = {
      name: '테스트 모임',
      explanation: '테스트 설명',
      limit: 10,
      thumbnail: 'testThumbnail.jpg',
      canJoin: true,
    };

    const result = await meetingComponent.create(createMeetingDto);

    expect(result.meeting_id).toBe(80);
    expect(result.name).toBe('테스트 모임');
    expect(result.explanation).toBe('테스트 설명');
    expect(result.limit).toBe(10);
    expect(result.thumbnail).toBe('testThumbnail.jpg');
    expect(result.canJoin).toBe(true);
  });

  it('updateTest', async () => {
    const meeting = Meeting.createForTest({
      meeting_id: 50,
      name: '업데이트한 모임 이름',
      explanation: '업데이트한 모임 설명',
      limit: 3,
      thumbnail: 'updateThumbnail.jpg',
      canJoin: false,
    });

    await meetingComponent.update(meeting);

    const result = await meetingComponent.findByMeetingId(50);

    expect(result.meeting_id).toBe(50);
    expect(result.name).toBe('업데이트한 모임 이름');
    expect(result.explanation).toBe('업데이트한 모임 설명');
    expect(result.limit).toBe(3);
    expect(result.thumbnail).toBe('updateThumbnail.jpg');
    expect(result.canJoin).toBe(false);
  });

  it('findAllTest', async () => {
    const result = await meetingComponent.findAll();

    expect(result.length).toBe(2);
    expect(result[0].meeting_id).toBe(50);
    expect(result[0].limit).toBe(5);
    expect(result[0].thumbnail).toBe('testThumbnail1.jpg');
    expect(result[0].canJoin).toBe(true);

    expect(result[1].meeting_id).toBe(200);
    expect(result[1].limit).toBe(7);
    expect(result[1].thumbnail).toBe('testThumbnail2.jpg');
    expect(result[1].canJoin).toBe(true);
  });

  it('deleteTest', async () => {
    const idToDelete = 50;
    const beforeDelete = await meetingComponent.findByMeetingId(idToDelete);

    expect(beforeDelete).toBeDefined();
    expect(beforeDelete.meeting_id).toBe(idToDelete);

    await meetingComponent.delete(50);

    const afterDelete = await meetingComponent.findByMeetingId(idToDelete);
    expect(afterDelete).toBeNull();
  });
});
