import { Test, TestingModule } from '@nestjs/testing';
import { MeetingServiceImpl } from '@service/meeting/service/meeting.service';
import { MeetingService } from '@service/meeting/service/meeting.service.interface';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Member } from '@domain/member/entity/member.entity';
import { ErrorMessageType } from '@enums/error.message.enum';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';
import { Keyword } from '@domain/meeting/entity/keyword.entity';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { Users } from '@domain/user/entity/users.entity';
import { Notification } from '@domain/notification/entity/notification.entity';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { KeywordComponent } from '@domain/meeting/component/keyword.component.interface';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';
import { MeetingCategoryEnum } from '@enums/meeting.category.enum';
import { MeetingUpdateRequest } from '@service/meeting/dto/request/meeting.update.request';

const componentAccessLog: string[] = [];

class MockMeetingComponent implements MeetingComponent {
  public static findByMeetingIdLog = 'MeetingComponent.findByMeetingId called';
  public static createLog = 'MeetingComponent.create called';
  public static updateLog = 'MeetingComponent.update called';

  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meetingId: 80,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 10,
      thumbnailId: 70,
      canJoin: false,
      category: MeetingCategoryEnum.CAREER,
      publicYn: true,
    }),
    Meeting.createForTest({
      meetingId: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 10,
      thumbnailId: 80,
      canJoin: true,
      category: MeetingCategoryEnum.CAREER,
      publicYn: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdLog);

    return this.mockMeetings.find((meeting) => meeting.id === id);
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    return this.mockMeetings.filter((meeting) => ids.includes(meeting.id));
  }

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    componentAccessLog.push(MockMeetingComponent.createLog);

    const meeting = Meeting.createForTest({ ...createMeetingDto, meetingId: 3 });

    this.mockMeetings.push(meeting);
    return meeting;
  }

  async update(): Promise<void> {
    componentAccessLog.push(MockMeetingComponent.updateLog);
  }

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(id: number): Promise<void> {
    this.mockMeetings = this.mockMeetings.filter((meeting) => meeting.id !== id);
  }

  async getNewMeetings(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async incrementLikeCount(): Promise<void> {}
  async decrementLikeCount(): Promise<void> {}
}

class MockMemberComponent implements MemberComponent {
  public static findByUsersAndMeetingIdLog = 'MemberComponent.findByUsersAndMeetingId called';
  public static findByMeetingIdLog = 'MemberComponent.findByMeetingId called';
  public static saveAllLog = 'MemberComponent.saveAll called';
  public static findByUsersAndAuthoritiesLog = 'MemberComponent.findByUsersAndAuthorities called';

  private mockMembers: Member[] = [
    Member.create({
      meetingId: 80,
      userId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      userId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '이 스터디에 꼭 들어가고 싶어요.',
    }),
  ];

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndMeetingIdLog);

    const member = this.mockMembers.find((member) => member.userId === userId && member.meetingId === meetingId);
    return member || null;
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => userIds.includes(member.userId) && member.meetingId === meetingId);
  }

  async findByUsersAndAuthorities(userId: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.userId === userId && authorities.includes(member.authority));
  }

  async findByUserId(userId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.userId === userId);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByMeetingIdLog);

    return this.mockMembers.filter((member) => member.meetingId === meetingId);
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = Member.create(createMemberDto);
    this.mockMembers.push(member);
    return member;
  }

  async countByMeetingIdAndAuthority(meetingId: number, authority: AuthorityEnumType): Promise<number> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId && member.authority === authority).length;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    member.authority = authority;
  }

  async deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void> {
    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.userId === userId && member.meetingId === meetingId),
    );
  }

  async saveAll(members: Member[]): Promise<void> {
    componentAccessLog.push(MockMemberComponent.saveAllLog);

    members.forEach((member) => {
      this.mockMembers.push(member);
    });
  }

  async getMemberCount(meetingId: number): Promise<number> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId).length;
  }

  async getMostPopularMeetingIds(): Promise<number[]> {
    return this.mockMembers.map((member) => member.meetingId);
  }
}

class MockKeywordComponent implements KeywordComponent {
  public static saveAllLog = 'KeywordComponent.saveAll called';

  private keywordCount = 0;

  async countByMeetingId(): Promise<number> {
    return this.keywordCount;
  }

  async saveAll(keywords: Keyword[]): Promise<void> {
    componentAccessLog.push(MockKeywordComponent.saveAllLog);

    this.keywordCount += keywords.length;
  }
}

class MockAuthorityComponent implements AuthorityComponent {
  public static validateAuthorityLog = 'AuthorityComponent.validateAuthority called';

  async validateAuthority() {
    componentAccessLog.push(MockAuthorityComponent.validateAuthorityLog);
  }
}

class MockNotificationComponent implements NotificationComponent {
  public static addNotificationsLog = 'NotificationComponent.addNotifications called';

  async addNotifications() {
    componentAccessLog.push(MockNotificationComponent.addNotificationsLog);
  }

  async addNotification() {}

  async getListByNotificationIds(): Promise<Notification[]> {
    return [];
  }
  async getListByUserId(): Promise<Notification[]> {
    return [];
  }
  async saveAll() {}
}

class MockUsersComponent implements UsersComponent {
  public static findByIdLog = 'UsersComponent.findById called';
  public static findByIdsLog = 'UsersComponent.findByIds called';

  private mockUsers: Users[] = [
    Users.createForTest({
      id: 200,
      discordId: 'discordIdOne',
      username: 'kimmoiji',
      email: 'kimmoiji@test.com',
      explanation: 'explanation1',
      profileImageId: 50,
      settings: { allowNotificationYn: true },
    }),
    Users.createForTest({
      id: 512,
      discordId: 'discordIdTwo',
      username: 'parkmoiji',
      email: 'Parkmoiji@test.com',
      explanation: 'explanation2',
      profileImageId: 70,
      settings: { allowNotificationYn: true },
    }),
  ];

  async findById(user_id: number): Promise<Users | null> {
    componentAccessLog.push(MockUsersComponent.findByIdLog);

    const user = this.mockUsers.find((user) => user.id === user_id);
    return user || null;
  }

  async findByIds(): Promise<Users[]> {
    componentAccessLog.push(MockUsersComponent.findByIdsLog);

    return this.mockUsers;
  }

  async createUsers(): Promise<Users> {
    return null;
  }

  async findByDiscordId(): Promise<Users | null> {
    return null;
  }
}

jest.mock('typeorm-transactional', () => ({ Transactional: () => () => {} }));

describe('MeetingService', () => {
  let meetingService: MeetingService;
  let meetingComponent: MeetingComponent;

  beforeEach(async () => {
    componentAccessLog.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MeetingService', useClass: MeetingServiceImpl },
        {
          provide: 'FileService',
          useValue: {
            uploadThumbnailFile: async () => 'test/path',
          },
        },
        { provide: 'MeetingComponent', useClass: MockMeetingComponent },
        { provide: 'MemberComponent', useClass: MockMemberComponent },
        { provide: 'KeywordComponent', useClass: MockKeywordComponent },
        {
          provide: 'UsersComponent',
          useClass: MockUsersComponent,
        },
        {
          provide: 'AuthorityComponent',
          useClass: MockAuthorityComponent,
        },
        {
          provide: 'NotificationComponent',
          useClass: MockNotificationComponent,
        },
      ],
    }).compile();

    meetingService = module.get<MeetingService>('MeetingService');
    meetingComponent = module.get<MeetingComponent>('MeetingComponent');
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
        category: MeetingCategoryEnum.CAREER,
        publicYn: true,
      };
      const result = await meetingService.createMeeting(req, 1);

      expect(result).toBe('3');

      expect(componentAccessLog).toEqual([
        MockMeetingComponent.createLog,
        MockKeywordComponent.saveAllLog,
        MockMemberComponent.saveAllLog,
        MockNotificationComponent.addNotificationsLog,
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
        category: MeetingCategoryEnum.CAREER,
        publicYn: true,
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
        category: MeetingCategoryEnum.CAREER,
        publicYn: true,
      };

      await expect(meetingService.createMeeting(req, 1)).rejects.toThrow(ErrorMessageType.INVALID_KEYWORD_LENGTH);
    });
  });

  describe('updateMeetingTest', () => {
    it('updateMeetingTest - SUCCESS', async () => {
      const req: MeetingUpdateRequest = {
        meetingId: 'c8',
        name: '수정된 모임이름',
        explanation: '수정된 모임 설명',
        limit: 3,
        canJoin: false,
        publicYn: true,
      };

      await meetingService.updateMeeting(req, 1);

      const updatedMeeting = await meetingComponent.findByMeetingId(200);
      expect(updatedMeeting.id).toBe(200);
      expect(updatedMeeting.name).toBe('수정된 모임이름');
      expect(updatedMeeting.explanation).toBe('수정된 모임 설명');
      expect(updatedMeeting.limit).toBe(3);
      expect(updatedMeeting.canJoin).toBe(false);

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockMeetingComponent.findByMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
        MockNotificationComponent.addNotificationsLog,
        MockMeetingComponent.updateLog,
        MockMeetingComponent.findByMeetingIdLog,
      ]);
    });

    it('updateMeetingTest - NOT_FOUND_MEETING', async () => {
      const req: MeetingUpdateRequest = {
        meetingId: '999',
        name: '수정된 모임이름',
        explanation: '수정된 모임 설명',
        limit: 10,
        canJoin: true,
        publicYn: true,
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
    const updatedMeeting = await meetingComponent.findByMeetingId(80);

    expect(updatedMeeting.thumbnail).toBe('test/path');

    expect(componentAccessLog).toEqual([
      MockAuthorityComponent.validateAuthorityLog,
      MockMeetingComponent.findByMeetingIdLog,
      MockMeetingComponent.updateLog,
      MockMemberComponent.findByMeetingIdLog,
      MockNotificationComponent.addNotificationsLog,
      MockMeetingComponent.findByMeetingIdLog,
    ]);
  });

  it('deleteMeetingTest - SUCCESS', async () => {
    await meetingService.deleteMeeting('50', 200);

    const deletedMeeting = await meetingComponent.findByMeetingId(80);
    expect(deletedMeeting).toBeUndefined();

    expect(componentAccessLog).toEqual([
      MockAuthorityComponent.validateAuthorityLog,
      MockMeetingComponent.findByMeetingIdLog,
      MockMemberComponent.findByMeetingIdLog,
      MockNotificationComponent.addNotificationsLog,
      MockMeetingComponent.findByMeetingIdLog,
    ]);
  });

  describe('getMeetingTest', () => {
    it('getMeetingTest - SUCCESS', async () => {
      const result = await meetingService.getMeeting('50', 200);

      expect(result.name).toBe('모임 이름1');
      expect(result.explanation).toBe('모임 설명1');
      expect(result.limit).toBe(10);
      expect(result.thumbnailId).toBe(70);

      expect(componentAccessLog).toEqual([
        MockMeetingComponent.findByMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
        MockUsersComponent.findByIdsLog,
      ]);
    });

    it('getMeetingTest - NOT_FOUND_MEETING', async () => {
      await expect(meetingService.getMeeting('999', 200)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEETING);
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

      expect(componentAccessLog).toEqual([
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });
  });
});
