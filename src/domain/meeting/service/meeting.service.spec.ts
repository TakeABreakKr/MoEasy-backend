import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { MeetingServiceImpl } from './meeting.service';
import { MeetingService } from './meeting.service.interface';
import { Meeting } from '../entity/meeting.entity';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { KeywordDao } from '../dao/keyword.dao.interface';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { MeetingUpdateRequest } from '../dto/request/meeting.update.request';
import { AuthorityEnum } from '@root/enums/authority.enum';

class MockMeetingDao implements MeetingDao {
  private mockMeeting: Meeting | null = null;
  private mockMeetings: Meeting[] = [];

  setMockMeeting(meeting: Meeting | null) {
    this.mockMeeting = meeting;
  }

  setMockMeetings(meetings: Meeting[]) {
    this.mockMeetings = meetings.map((meeting, index) => {
      meeting.meeting_id = index + 1;
      return meeting;
    });
  }

  async findByMeetingId(): Promise<Meeting | null> {
    return this.mockMeeting;
  }

  async findByMeetingIds(): Promise<Meeting[]> {
    return [];
  }

  async create(): Promise<Meeting> {
    const meeting = new Meeting();
    meeting.meeting_id = 30;
    return meeting;
  }

  async update(): Promise<void> {}

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(): Promise<void> {}
}

class MockMemberDao implements MemberDao {
  private mockMember: Member | null = null;

  setMockMember(member: Member | null) {
    this.mockMember = member;
  }

  async findByUsersAndMeetingId(): Promise<Member | null> {
    return this.mockMember;
  }

  async findByUsersAndAuthorities(): Promise<Member[]> {
    return [];
  }

  async findByUserId(): Promise<Member[]> {
    return [];
  }

  async findByMeetingId(): Promise<Member[]> {
    return [];
  }

  async create(): Promise<Member> {
    return new Member();
  }

  async updateAuthority(): Promise<void> {}

  async findAll(): Promise<Meeting[]> {
    return [];
  }

  async deleteByUsersAndMeetingId(): Promise<void> {
    this.mockMember = null;
  }

  async saveAll(): Promise<void> {}
}

class MockKeywordDao implements KeywordDao {
  private number = 3;

  setNumber(num: number) {
    this.number = num;
  }

  async countByMeetingId(): Promise<number> {
    return this.number;
  }

  async saveAll(): Promise<void> {}
}

describe('MeetingService', () => {
  let meetingService: MeetingService;
  let meetingDao: MeetingDao;
  let memberDao: MemberDao;
  let keywordDao: KeywordDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MeetingService', useClass: MeetingServiceImpl },
        {
          provide: 'FileService',
          useValue: {
            uploadThumbnailFile: async () => 'test/path',
          },
        },
        { provide: 'MeetingDao', useClass: MockMeetingDao },
        { provide: 'MemberDao', useClass: MockMemberDao },
        { provide: 'KeywordDao', useClass: MockKeywordDao },
        { provide: 'UsersDao', useValue: { findByIds: () => [] } },
        {
          provide: 'AuthorityComponent',
          useValue: {
            validateAuthority: async () => {},
          },
        },
        {
          provide: 'NotificationComponent',
          useValue: {
            addNotifications: async () => {},
          },
        },
      ],
    }).compile();

    meetingService = module.get<MeetingService>('MeetingService');
    meetingDao = module.get<MockMeetingDao>('MeetingDao');
    memberDao = module.get<MockMemberDao>('MemberDao');
    keywordDao = module.get<MockKeywordDao>('KeywordDao');
  });

  const defaultMockMeeting = (): Meeting => {
    const meeting = new Meeting();
    meeting.name = '기본 모임 이름';
    meeting.explanation = '기본 모임 설명';
    meeting.limit = 5;
    meeting.thumbnail = '기본/썸네일/경로.jpg';
    meeting.canJoin = true;
    meeting.meeting_id = 1;

    return meeting;
  };

  describe('createMeetingTest', () => {
    it('createMeetingTest - SUCCESS', async () => {
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 5,
        thumbnail: {} as Express.Multer.File,
        canJoin: true,
        keywords: ['키워드1', '키워드2'],
        members: [1, 2, 3],
      };

      (meetingDao as MockMeetingDao).setMockMeeting({
        meeting_id: 1,
        name: '테스트 모임 이름',
      } as Meeting);
      const result = await meetingService.createMeeting(req, 1);

      expect(result).toBeDefined();
      expect(result).toBe('1e');
    });

    it('createMeetingTest - KEYWORD_LIMIT_EXCEEDED', async () => {
      (keywordDao as MockKeywordDao).setNumber(13);
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 5,
        thumbnail: {} as Express.Multer.File,
        canJoin: true,
        keywords: ['키워드1', '키워드2'],
        members: [1, 2, 3],
      };

      await expect(meetingService.createMeeting(req, 1)).rejects.toThrow(ErrorMessageType.KEYWORD_LIMIT_EXCEEDED);
    });

    it('createMeetingTest - KEYWORD_LIMIT_EXCEEDED', async () => {
      (keywordDao as MockKeywordDao).setNumber(0);
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 5,
        thumbnail: {} as Express.Multer.File,
        canJoin: true,
        keywords: ['이키워드는열글자를넘어가는키워드입니다1', '이키워드는열글자를넘어가는키워드입니다2'],
        members: [1, 2, 3],
      };

      await expect(meetingService.createMeeting(req, 1)).rejects.toThrow(ErrorMessageType.INVALID_KEYWORD_LENGTH);
    });
  });

  describe('updateMeetingTest', () => {
    it('updateMeetingTest - SUCCESS', async () => {
      const meeting = defaultMockMeeting();
      (meetingDao as MockMeetingDao).setMockMeeting(meeting);

      const req = {
        meeting_id: '1',
        name: '수정된 모임이름',
        explanation: '수정된 모임 설명',
        limit: 10,
        canJoin: true,
      };

      await meetingService.updateMeeting(req, 1);

      expect(meeting.name).toBe('수정된 모임이름');
      expect(meeting.explanation).toBe('수정된 모임 설명');
      expect(meeting.limit).toBe(10);
      expect(meeting.canJoin).toBe(true);
    });

    it('updateMeetingTest - NOT_FOUND_MEETING', async () => {
      (meetingDao as MockMeetingDao).setMockMeeting(null);
      const req = { meeting_id: '999' } as MeetingUpdateRequest;

      await expect(meetingService.updateMeeting(req, 1)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEETING);
    });
  });

  it('updateMeetingThumbnailTest - SUSESS', async () => {
    const meeting = defaultMockMeeting();
    (meetingDao as MockMeetingDao).setMockMeeting(meeting);

    const req = {
      meetingId: '1',
      thumbnail: {} as Express.Multer.File,
    };

    await meetingService.updateMeetingThumbnail(req, 1);

    expect(meeting.thumbnail).toBe('test/path');
  });

  it('deleteMeetingTest - SUSESS', async () => {
    const meeting = defaultMockMeeting();
    (meetingDao as MockMeetingDao).setMockMeeting(meeting);

    await expect(meetingService.deleteMeeting('1', 1)).resolves.not.toThrow();
  });

  describe('updateMeetingTest', () => {
    it('getMeetingTest', async () => {
      const meeting = defaultMockMeeting();
      (meetingDao as MockMeetingDao).setMockMeeting(meeting);

      const result = await meetingService.getMeeting('1');

      expect(result).toBeDefined();
      expect(result.name).toBe('기본 모임 이름');
    });

    it('getMeetingTest - NOT_FOUND_MEETING', async () => {
      (meetingDao as MockMeetingDao).setMockMeeting(null);

      await expect(meetingService.getMeeting('1')).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEETING);
    });
  });

  describe('getMeetingListTest', () => {
    it('getMeetingListTest - Without_user_ID', async () => {
      const meetings = [defaultMockMeeting(), defaultMockMeeting()];
      (meetingDao as MockMeetingDao).setMockMeetings(meetings);

      const result = await meetingService.getMeetingList();

      expect(result.meetingList).toBeDefined();
      expect(result.meetingList.length).toBe(2);
      expect(result.meetingList[0].name).toBe('기본 모임 이름');
      expect(result.meetingList[1].canJoin).toBe(true);
    });

    it('getMeetingListTest - Authorized_User', async () => {
      const meetings = [defaultMockMeeting(), defaultMockMeeting()];
      const member = new Member();
      member.authority = AuthorityEnum.MANAGER;

      (meetingDao as MockMeetingDao).setMockMeetings(meetings);
      (memberDao as MockMemberDao).setMockMember(member);

      const result = await meetingService.getMeetingList(1, [AuthorityEnum.MANAGER]);

      expect(result.meetingList).toBeDefined();
      expect(result.meetingList.length).toBe(2);

      result.meetingList.forEach((meeting) => {
        expect(meeting.authority).toBe(AuthorityEnum.MANAGER);
      });
    });
  });
});
