import { Test, TestingModule } from '@nestjs/testing';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { MeetingServiceImpl } from './meeting.service';
import { MeetingService } from './meeting.service.interface';
import { Meeting } from '../entity/meeting.entity';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { KeywordDao } from '../dao/keyword.dao.interface';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMeetingDto } from '../dto/create.meeting.dto';
import { Keyword } from '../entity/keyword.entity';
import { CreateMemberDto } from '../dto/create.member.dto';
import { AuthorityComponent } from '@domain/meeting/component/authority.component.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { Users } from '@domain/user/entity/users.entity';

const daoAccessLog: string[] = [];

class MockMeetingDao implements MeetingDao {
  private mockMeetings: Meeting[] = [
    (() => {
      const meeting = Meeting.create({
        name: '모임 이름1',
        explanation: '모임 설명1',
        limit: 10,
        thumbnail: 'testThumbnail1.jpg',
        canJoin: true,
      });

      meeting.meeting_id = 80;
      return meeting;
    })(),

    (() => {
      const meeting = Meeting.create({
        name: '모임 이름2',
        explanation: '모임 설명2',
        limit: 10,
        thumbnail: 'testThumbnail2.jpg',
        canJoin: true,
      });

      meeting.meeting_id = 200;
      return meeting;
    })(),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    daoAccessLog.push('MeetingDao.findByMeetingId called');

    const meeting = this.mockMeetings.find((meeting) => meeting.meeting_id === id);
    return meeting;
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    return this.mockMeetings.filter((meeting) => ids.includes(meeting.meeting_id));
  }

  async create(props: CreateMeetingDto): Promise<Meeting> {
    daoAccessLog.push('MeetingDao.create called');

    const meeting = Meeting.create(props);

    meeting.meeting_id = 3;
    this.mockMeetings.push(meeting);
    return meeting;
  }

  async update(): Promise<void> {
    daoAccessLog.push('MeetingDao.update called');
  }

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(id: number): Promise<void> {
    this.mockMeetings = this.mockMeetings.filter((meeting) => meeting.meeting_id !== id);
  }
}

class MockMemberDao implements MemberDao {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 80,
      usersId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      usersId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '이 스터디에 꼭 들어가고 싶어요.',
    }),
  ];

  async findByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<Member | null> {
    daoAccessLog.push('MemberDao.findByUsersAndMeetingId called');

    const member = this.mockMembers.find((member) => member.users_id === users_id && member.meeting_id === meeting_id);
    return member || null;
  }

  async findByUsersAndAuthorities(users_id: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.users_id === users_id && authorities.includes(member.authority));
  }

  async findByUserId(users_id: number): Promise<Member[]> {
    return this.mockMembers.filter((m) => m.users_id === users_id);
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    daoAccessLog.push('MemberDao.findByMeetingId called');

    return this.mockMembers.filter((member) => member.meeting_id === meeting_id);
  }

  async create(props: CreateMemberDto): Promise<Member> {
    const member = Member.create({
      meetingId: props.meetingId,
      usersId: props.usersId,
      authority: props.authority,
      applicationMessage: props.applicationMessage,
    });
    this.mockMembers.push(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    member.authority = authority;
  }

  async deleteByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<void> {
    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.users_id === users_id && member.meeting_id === meeting_id),
    );
  }

  async saveAll(members: Member[]): Promise<void> {
    daoAccessLog.push('MemberDao.saveAll called');

    members.forEach((member) => {
      this.mockMembers.push(member);
    });
  }
}

class MockKeywordDao implements KeywordDao {
  private keywordCount = 0;

  async countByMeetingId(): Promise<number> {
    return this.keywordCount;
  }

  async saveAll(keywords: Keyword[]): Promise<void> {
    daoAccessLog.push('KeywordDao.saveAll called');

    this.keywordCount += keywords.length;
  }
}

describe('MeetingService', () => {
  let meetingService: MeetingService;
  let meetingDao: MeetingDao;

  beforeEach(async () => {
    daoAccessLog.length = 0;

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
        {
          provide: 'UsersDao',
          useValue: {
            findByIds: () => {
              daoAccessLog.push('UsersDao.findByIds called');
              return [
                { users_id: 200, username: '사용자1' },
                { users_id: 512, username: '사용자2' },
              ];
            },
          },
        },
        {
          provide: 'AuthorityComponent',
          useValue: {
            validateAuthority: async () => {
              daoAccessLog.push('AuthorityComponent.validateAuthority called');
            },
          },
        },
        {
          provide: 'NotificationComponent',
          useValue: {
            addNotifications: async () => {
              daoAccessLog.push('addNotifications called');
            },
          },
        },
      ],
    }).compile();

    meetingService = module.get<MeetingService>('MeetingService');
    meetingDao = module.get<MockMeetingDao>('MeetingDao');
  });

  describe('createMeetingTest', () => {
    it('createMeetingTest - SUCCESS', async () => {
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 5,
        thumbnail: null,
        canJoin: true,
        keywords: ['정상적인키워드1', '정상적인키워드2'],
        members: [1, 2, 3],
      };
      const result = await meetingService.createMeeting(req, 1);

      expect(result).toBe('3');

      expect(daoAccessLog).toEqual([
        'MeetingDao.create called',
        'KeywordDao.saveAll called',
        'MemberDao.saveAll called',
        'addNotifications called',
      ]);
    });

    it('createMeetingTest - KEYWORD_LIMIT_EXCEEDED', async () => {
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 10,
        thumbnail: null,
        canJoin: true,
        keywords: [
          '키워드1',
          '키워드2',
          '키워드3',
          '키워드4',
          '키워드5',
          '키워드6',
          '키워드7',
          '키워드8',
          '키워드9',
          '키워드10',
          '키워드11',
          '키워드12',
        ],
        members: [1, 2, 3],
      };

      await expect(meetingService.createMeeting(req, 1)).rejects.toThrow(ErrorMessageType.KEYWORD_LIMIT_EXCEEDED);
    });

    it('createMeetingTest - KEYWORD_LIMIT_EXCEEDED', async () => {
      const req = {
        name: '테스트 모임 이름',
        explanation: '테스트 모임 설명',
        limit: 10,
        thumbnail: null,
        canJoin: true,
        keywords: ['이키워드는열글자를넘어가는키워드입니다1', '이키워드는열글자를넘어가는키워드입니다2'],
        members: [1, 2, 3],
      };

      await expect(meetingService.createMeeting(req, 1)).rejects.toThrow(ErrorMessageType.INVALID_KEYWORD_LENGTH);
    });
  });

  describe('updateMeetingTest', () => {
    it('updateMeetingTest - SUCCESS', async () => {
      const req = {
        meeting_id: 'c8',
        name: '수정된 모임이름',
        explanation: '수정된 모임 설명',
        limit: 3,
        canJoin: false,
      };

      await meetingService.updateMeeting(req, 1);

      const updatedMeeting = await meetingDao.findByMeetingId(200);
      expect(updatedMeeting.meeting_id).toBe(200);
      expect(updatedMeeting.name).toBe('수정된 모임이름');
      expect(updatedMeeting.explanation).toBe('수정된 모임 설명');
      expect(updatedMeeting.limit).toBe(3);
      expect(updatedMeeting.canJoin).toBe(true);

      expect(daoAccessLog).toEqual([
        'AuthorityComponent.validateAuthority called',
        'MeetingDao.findByMeetingId called',
        'MemberDao.findByMeetingId called',
        'MeetingDao.update called',
        'MeetingDao.findByMeetingId called',
      ]);
    });

    it('updateMeetingTest - NOT_FOUND_MEETING', async () => {
      const req = {
        meeting_id: '999',
        name: '수정된 모임이름',
        explanation: '수정된 모임 설명',
        limit: 10,
        canJoin: true,
      };

      await expect(meetingService.updateMeeting(req, 1)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEETING);
    });
  });

  it('updateMeetingThumbnailTest - SUCCESS', async () => {
    const req = {
      meetingId: '50',
      thumbnail: null,
    };

    await meetingService.updateMeetingThumbnail(req, 80);
    const updatedMeeting = await meetingDao.findByMeetingId(80);

    expect(updatedMeeting.thumbnail).toBe('test/path');

    expect(daoAccessLog).toEqual([
      'AuthorityComponent.validateAuthority called',
      'MeetingDao.findByMeetingId called',
      'MeetingDao.update called',
      'MemberDao.findByMeetingId called',
      'addNotifications called',
      'MeetingDao.findByMeetingId called',
    ]);
  });

  it('deleteMeetingTest - SUCCESS', async () => {
    await meetingService.deleteMeeting('50', 200);

    const deletedMeeting = await meetingDao.findByMeetingId(80);
    expect(deletedMeeting).toBeUndefined();

    expect(daoAccessLog).toEqual([
      'AuthorityComponent.validateAuthority called',
      'MeetingDao.findByMeetingId called',
      'MemberDao.findByMeetingId called',
      'addNotifications called',
      'MeetingDao.findByMeetingId called',
    ]);
  });

  describe('getMeetingTest', () => {
    it('getMeetingTest - SUCCESS', async () => {
      const result = await meetingService.getMeeting('50');

      expect(result.name).toBe('모임 이름1');
      expect(result.explanation).toBe('모임 설명1');
      expect(result.limit).toBe(10);
      expect(result.thumbnail).toBe('testThumbnail1.jpg');

      expect(daoAccessLog).toEqual([
        'MeetingDao.findByMeetingId called',
        'MemberDao.findByMeetingId called',
        'UsersDao.findByIds called',
      ]);
    });

    it('getMeetingTest - NOT_FOUND_MEETING', async () => {
      await expect(meetingService.getMeeting('999')).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEETING);
    });
  });

  describe('getMeetingListTest', () => {
    it('getMeetingListTest - WITHOUT_USER_ID', async () => {
      const result = await meetingService.getMeetingList();

      expect(result.meetingList.length).toBe(2);
      expect(result.meetingList[0].name).toBe('모임 이름1');
      expect(result.meetingList[0].explanation).toBe('모임 설명1');
      expect(result.meetingList[0].canJoin).toBe(false);

      expect(result.meetingList[1].name).toBe('모임 이름2');
      expect(result.meetingList[1].explanation).toBe('모임 설명2');
      expect(result.meetingList[1].canJoin).toBe(true);
    });

    it('getMeetingListTest - AUTHORIZED_USER', async () => {
      const result = await meetingService.getMeetingList(200, [AuthorityEnum.MANAGER]);

      expect(result.meetingList.length).toBe(2);

      result.meetingList.forEach((meeting) => {
        expect(meeting.authority).toBe(AuthorityEnum.MANAGER);
      });

      expect(daoAccessLog).toEqual([
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.findByUsersAndMeetingId called',
      ]);
    });
  });
});
