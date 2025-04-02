import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '@service/member/service/member.service.interface';
import { MemberServiceImpl } from '@service/member/service/member.service';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Member } from '@domain/member/entity/member.entity';
import { ErrorMessageType } from '@enums/error.message.enum';
import { Users } from '@domain/user/entity/users.entity';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { Notification } from '@domain/notification/entity/notification.entity';
import { MeetingCategoryEnum } from '@enums/meeting.category.enum';

const componentAccessLog: string[] = [];

class MockMeetingComponent implements MeetingComponent {
  public static findByMeetingIdLog = 'MeetingComponent.findByMeetingId called';

  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meetingId: 80,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 10,
      thumbnailId: 20,
      canJoin: false,
      category: MeetingCategoryEnum.STUDY,
      publicYn: true,
    }),
    Meeting.createForTest({
      meetingId: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 10,
      thumbnailId: 30,
      canJoin: true,
      category: MeetingCategoryEnum.STUDY,
      publicYn: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdLog);

    return this.mockMeetings.find((meeting) => meeting.id === id);
  }

  async findByMeetingIds(): Promise<Meeting[]> {
    return [];
  }

  async create(): Promise<Meeting> {
    return;
  }

  async update(): Promise<void> {}

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(): Promise<void> {}

  async getNewMeetings(): Promise<Meeting[]> {
    return this.mockMeetings;
  }
}

class MockMemberComponent implements MemberComponent {
  public static findByUsersAndMeetingIdLog = 'MemberComponent.findByUsersAndMeetingId called';
  public static findByMeetingIdLog = 'MemberComponent.findByMeetingId called';
  public static updateAuthorityLog = 'MemberComponent.updateAuthority called';
  public static deleteByUsersAndMeetingIdLog = 'MemberComponent.deleteByUsersAndMeetingId called';
  public static saveAllLog = 'MemberComponent.saveAll called';
  public static findByUsersAndAuthoritiesLog = 'MemberComponent.findByUsersAndAuthorities called';

  private mockMembers: Member[] = [
    Member.create({
      meetingId: 80,
      userId: 80,
      authority: AuthorityEnum.MANAGER,
    }),
    Member.create({
      meetingId: 200,
      userId: 80,
      authority: AuthorityEnum.MANAGER,
    }),
    Member.create({
      meetingId: 80,
      userId: 15,
      authority: AuthorityEnum.WAITING,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 80,
      userId: 200,
      authority: AuthorityEnum.MEMBER,
    }),
    Member.create({
      meetingId: 80,
      userId: 60,
      authority: AuthorityEnum.OWNER,
    }),
  ];

  private mockUsers: Users[] = [
    Users.createForTest({
      id: 80,
      discordId: 'discordIdOne',
      username: 'kimmoiji',
      avatar: 'avatar1',
      email: 'kimmoiji@test.com',
      explanation: 'explanation1',
      profileImageId: 10,
      settings: { allowNotificationYn: false },
    }),
    Users.createForTest({
      id: 200,
      discordId: 'discordIdThree',
      username: 'parkmoiji2',
      avatar: 'avatar3',
      email: 'parkmoiji2@test.com',
      explanation: 'explanation3',
      profileImageId: 30,
      settings: { allowNotificationYn: false },
    }),
    Users.createForTest({
      id: 15,
      discordId: 'discordIdFour',
      username: 'kimmoiji2',
      avatar: 'avatar4',
      email: 'kimmoiji2@test.com',
      explanation: 'explanation4',
      profileImageId: 40,
      settings: { allowNotificationYn: false },
    }),
  ];

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndMeetingIdLog);

    const member = this.mockMembers.find((member) => member.userId === userId && member.meetingId === meetingId);
    if (member) {
      member.user = Promise.resolve(this.mockUsers.find((user) => user.id === userId) || null);
    }
    return member || null;
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => userIds.includes(member.userId) && member.meetingId === meetingId);
  }

  async findByUsersAndAuthorities(userId: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndAuthoritiesLog);

    return this.mockMembers.filter((member) => member.userId === userId && authorities.includes(member.authority));
  }

  async findByUserId(userId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.userId === userId);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByMeetingIdLog);

    const members = this.mockMembers.filter((member) => member.meetingId === meetingId);
    members.forEach((member) => {
      member.user = Promise.resolve(this.mockUsers.find((user) => user.id === member.userId) || null);
    });
    return members;
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = Member.create(createMemberDto);
    this.mockMembers.push(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    componentAccessLog.push(MockMemberComponent.updateAuthorityLog);

    member.authority = authority;
  }

  async deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void> {
    componentAccessLog.push(MockMemberComponent.deleteByUsersAndMeetingIdLog);

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

class MockUsersComponent implements UsersComponent {
  static findByIdLog = 'UsersComponent.findById called';

  private mockUsers: Users[] = [
    Users.createForTest({
      id: 80,
      discordId: 'discordIdOne',
      username: 'kimmoiji',
      avatar: 'avatar1',
      email: 'kimmoiji@test.com',
      explanation: 'explanation1',
      profileImageId: 20,
      settings: { allowNotificationYn: true },
    }),
    Users.createForTest({
      id: 60,
      discordId: 'discordIdTwo',
      username: 'parkmoiji',
      avatar: 'avatar2',
      email: 'Parkmoiji@test.com',
      explanation: 'explanation2',
      profileImageId: 30,
      settings: { allowNotificationYn: true },
    }),
    Users.createForTest({
      id: 200,
      discordId: 'discordIdThree',
      username: 'parkmoiji2',
      avatar: 'avatar3',
      email: 'parkmoiji2@test.com',
      explanation: 'explanation3',
      profileImageId: 40,
      settings: { allowNotificationYn: true },
    }),
  ];

  async findById(user_id: number): Promise<Users | null> {
    componentAccessLog.push(MockUsersComponent.findByIdLog);

    return this.mockUsers.find((user) => user.id === user_id) || null;
  }

  async findByIds(): Promise<Users[]> {
    return [];
  }

  async createUsers(): Promise<Users> {
    return null;
  }

  async findByDiscordId(): Promise<Users | null> {
    return null;
  }
}

class MockAuthorityComponent implements AuthorityComponent {
  public static validateAuthorityLog = 'AuthorityComponent.validateAuthority called';

  async validateAuthority() {
    componentAccessLog.push(MockAuthorityComponent.validateAuthorityLog);
  }
}

class MockNotificationComponent implements NotificationComponent {
  public static addNotificationsLog = 'Notification.addNotifications called';
  public static addNotificationLog = 'Notification.addNotification called';

  async getListByNotificationIds(): Promise<Notification[]> {
    return [];
  }
  async getListByUserId(): Promise<Notification[]> {
    return [];
  }
  async saveAll(): Promise<void> {}

  async addNotifications() {
    componentAccessLog.push(MockNotificationComponent.addNotificationsLog);
  }

  async addNotification() {
    componentAccessLog.push(MockNotificationComponent.addNotificationLog);
  }
}

jest.mock('typeorm-transactional', () => ({ Transactional: () => () => {} }));

describe('MemberService', () => {
  let memberService: MemberService;
  let memberComponent: MemberComponent;

  beforeEach(async () => {
    componentAccessLog.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MemberService', useClass: MemberServiceImpl },
        {
          provide: 'UsersComponent',
          useClass: MockUsersComponent,
        },
        { provide: 'MemberComponent', useClass: MockMemberComponent },
        { provide: 'MeetingComponent', useClass: MockMeetingComponent },
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

    memberService = module.get<MemberService>('MemberService');
    memberComponent = module.get<MemberComponent>('MemberComponent');
  });

  describe('getMemberTest', () => {
    it('getMemberTest - SUCCESS', async () => {
      const result = await memberService.getMember('50', 80);

      expect(result).toEqual({
        username: 'kimmoiji',
        explanation: 'explanation1',
        authority: AuthorityEnum.MANAGER,
      });

      expect(componentAccessLog).toEqual([
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockUsersComponent.findByIdLog,
      ]);
    });

    it('getMemberTest - NOT_FOUND_MEMBER(USER & MEMBER)', async () => {
      await expect(memberService.getMember('999', 999)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });
  });

  describe('withdrawTest', () => {
    it('withdrawTest - SUCCESS', async () => {
      await memberService.withdraw(200, '50');
      const withdrawMember = await memberComponent.findByUsersAndMeetingId(200, 200);

      expect(withdrawMember).toBeNull();

      expect(componentAccessLog).toEqual([
        MockUsersComponent.findByIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.deleteByUsersAndMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
        MockNotificationComponent.addNotificationsLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });

    it('withdrawTest - SUCCESS(OWNER_WITHDRAW)', async () => {
      await memberService.withdraw(60, '50');
      const withdrawOwner = await memberComponent.findByUsersAndMeetingId(60, 80);

      expect(withdrawOwner).toBeNull();

      const members = await memberComponent.findByMeetingId(80);
      const newOwner = members.find((member) => member.authority === AuthorityEnum.OWNER);

      expect(newOwner.userId).toBe(80);
      expect(newOwner.meetingId).toBe(80);
      expect(newOwner.authority).toBe(AuthorityEnum.OWNER);

      expect(componentAccessLog).toEqual([
        MockUsersComponent.findByIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.deleteByUsersAndMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
        MockNotificationComponent.addNotificationsLog,
        MockMemberComponent.updateAuthorityLog,
        MockNotificationComponent.addNotificationsLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
      ]);
    });

    it('withdrawTest - NOT_EXIST_REQUESTER(USER)', async () => {
      await expect(memberService.withdraw(999, '200')).rejects.toThrow(ErrorMessageType.NOT_EXIST_REQUESTER);
    });

    it('withdraw FAIL - NOT_EXIST_REQUESTER(MEMBER)', async () => {
      await expect(memberService.withdraw(80, '999')).rejects.toThrow(ErrorMessageType.NOT_EXIST_REQUESTER);
    });
  });

  describe('updateAuthorityTest', () => {
    it('updateAuthority - SUCCESS', async () => {
      const req = {
        meetingId: '50',
        userId: 200,
        isManager: true,
      };

      await memberService.updateAuthority(80, req);
      const updatedMember = await memberComponent.findByUsersAndMeetingId(200, 80);

      expect(updatedMember.authority).toBe(AuthorityEnum.MANAGER);
      expect(updatedMember.userId).toBe(200);
      expect(updatedMember.meetingId).toBe(80);

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.updateAuthorityLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });
  });

  describe('deleteMemberTest', () => {
    it('deleteMember - SUCCESS', async () => {
      const req = {
        meetingId: '50',
        memberId: 200,
      };

      await memberService.deleteMember(80, req);
      const deleteMember = await memberComponent.findByUsersAndMeetingId(200, 80);

      expect(deleteMember).toBeNull();

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.deleteByUsersAndMeetingIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });

    it('deleteMember - NOT_FOUND_MEMBER', async () => {
      const req = {
        meetingId: '50',
        memberId: 200,
      };

      await expect(memberService.deleteMember(999, req)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });
  });

  describe('joinTest', () => {
    it('joinTest - SUCCESS', async () => {
      const req = {
        meetingId: '50',
        joinMessage: '모임에 꼭 들어가고 싶습니다.',
      };

      await memberService.join(20, req);
      const joinMember = await memberComponent.findByUsersAndMeetingId(20, 80);

      expect(joinMember.authority).toBe(AuthorityEnum.WAITING);
      expect(joinMember.applicationMessage).toBe('모임에 꼭 들어가고 싶습니다.');

      expect(componentAccessLog).toEqual([
        MockMeetingComponent.findByMeetingIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });

    it('joinTest - JOIN_REQUEST_DISABLED', async () => {
      const req = {
        meetingId: 'c8',
        joinMessage: '모임에 꼭 들어가고 싶습니다.',
      };

      await expect(memberService.join(30, req)).rejects.toThrow(ErrorMessageType.JOIN_REQUEST_DISABLED);
    });
  });

  describe('getWaitingListTest', () => {
    it('getWaitingList - SUCCESS', async () => {
      const result = await memberService.getWaitingList(80);

      expect(result.meetings[0].name).toBe('모임 이름1');
      expect(result.meetings[1].name).toBe('모임 이름2');

      expect(componentAccessLog).toEqual([
        MockMemberComponent.findByUsersAndAuthoritiesLog,
        MockMemberComponent.findByMeetingIdLog,
        MockMemberComponent.findByMeetingIdLog,
        MockMeetingComponent.findByMeetingIdLog,
        MockMeetingComponent.findByMeetingIdLog,
      ]);
    });

    it('getWaitingList - EMPTY', async () => {
      const result = await memberService.getWaitingList(999);

      expect(result.meetings).toHaveLength(0);
    });
  });

  describe('manageMemberJoinTest', () => {
    it('manageMemberJoin - SUCCESS(수락)', async () => {
      const req = {
        meetingId: '50',
        memberId: 15,
        isAccepted: true,
      };

      await memberService.manageMemberJoin(80, req);
      const updatedMember = await memberComponent.findByUsersAndMeetingId(15, 80);

      expect(updatedMember.authority).toBe(AuthorityEnum.MEMBER);
      expect(updatedMember.userId).toBe(15);
      expect(updatedMember.meetingId).toBe(80);
      expect(updatedMember.applicationMessage).toBe('꼭 가입하고 싶습니다.');

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockAuthorityComponent.validateAuthorityLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.updateAuthorityLog,
        MockMemberComponent.findByMeetingIdLog,
        MockNotificationComponent.addNotificationsLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });

    it('manageMemberJoin - SUCCESS(거절)', async () => {
      const req = {
        meetingId: '50',
        memberId: 15,
        isAccepted: false,
      };

      await memberService.manageMemberJoin(20, req);
      const deletedMember = await memberComponent.findByUsersAndMeetingId(15, 80);

      expect(deletedMember).toBeNull();

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockAuthorityComponent.validateAuthorityLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockMemberComponent.deleteByUsersAndMeetingIdLog,
        MockNotificationComponent.addNotificationLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
      ]);
    });
  });
});
