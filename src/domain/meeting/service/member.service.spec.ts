import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service.interface';
import { MemberServiceImpl } from './member.service';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { Meeting } from '../entity/meeting.entity';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { UsersDao } from '@root/domain/user/dao/users.dao.interface';
import { Users } from '@root/domain/user/entity/users.entity';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';

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
    return new Meeting();
  }

  async update(): Promise<void> {}

  async findAll(): Promise<Meeting[]> {
    return this.mockMeetings;
  }

  async delete(): Promise<void> {}
}

class MockMemberDao implements MemberDao {
  private mockMember: Member | null = null;
  private members: Member[] = [];
  private managerMembers: Member[] = [];

  setMockMember(member: Member | null) {
    this.mockMember = member;
  }

  setMembers(members: Member[]) {
    this.members = members;
  }

  setManagerMembers(members: Member[]) {
    this.managerMembers = members;
  }

  async findByUsersAndMeetingId(): Promise<Member | null> {
    return this.mockMember;
  }

  async findByUsersAndAuthorities(): Promise<Member[]> {
    return this.managerMembers;
  }

  async findByUserId(): Promise<Member[]> {
    return [];
  }

  async findByMeetingId(): Promise<Member[]> {
    return this.members;
  }

  async create(): Promise<Member> {
    const member = new Member();
    member.authority = AuthorityEnum.WAITING;
    member.applicationMessage = '모임에 꼭 들어가고 싶습니다.';
    this.mockMember = member;
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    member.authority = authority;
    this.members = this.members.map((m) => (m.users_id === member.users_id ? member : m));
  }

  async findAll(): Promise<Meeting[]> {
    return [];
  }

  async deleteByUsersAndMeetingId(): Promise<void> {
    this.mockMember = null;
  }

  async saveAll(): Promise<void> {}
}

export class MockUsersDao implements UsersDao {
  private mockUser: Users | null = null;

  setMockUser(user: Users | null) {
    this.mockUser = user;
  }

  async findById(): Promise<Users | null> {
    return this.mockUser;
  }

  async findByIds(): Promise<Users[]> {
    return [];
  }

  async findByDiscordId(): Promise<Users | null> {
    return null;
  }

  async createUsers(): Promise<Users> {
    return new Users();
  }
}
describe('MemberService', () => {
  let memberService: MemberService;
  let memberDao: MemberDao;
  let usersDao: UsersDao;
  let meetingDao: MeetingDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MemberService', useClass: MemberServiceImpl },
        { provide: 'UsersDao', useClass: MockUsersDao },
        { provide: 'MemberDao', useClass: MockMemberDao },
        { provide: 'MeetingDao', useClass: MockMeetingDao },
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
            addNotification: async () => {},
          },
        },
      ],
    }).compile();

    memberService = module.get<MemberService>('MemberService');
    memberDao = module.get<MemberDao>('MemberDao');
    meetingDao = module.get<MeetingDao>('MeetingDao');
    usersDao = module.get<UsersDao>('UsersDao');
  });

  describe('getMemberTest', () => {
    it('getMemberTest - SUCCESS', async () => {
      const mockMember = new Member();
      mockMember.authority = AuthorityEnum.MANAGER;

      const mockUser = new Users();
      mockUser.username = '테스트유저';
      mockUser.explanation = '테스트설명';

      (memberDao as MockMemberDao).setMockMember(mockMember);
      (usersDao as MockUsersDao).setMockUser(mockUser);

      const result = await memberService.getMember('20', 20);

      expect(result).toEqual({
        username: '테스트유저',
        explanation: '테스트설명',
        authority: AuthorityEnum.MANAGER,
      });
    });

    it('getMemberTest - NOT_FOUND_MEMBER(USER)', async () => {
      const mockMember = new Member();
      mockMember.authority = AuthorityEnum.MANAGER;

      const mockUser = new Users();
      mockUser.username = '테스트유저';
      mockUser.explanation = '테스트설명';

      (memberDao as MockMemberDao).setMockMember(mockMember);
      (usersDao as MockUsersDao).setMockUser(null);

      await expect(memberService.getMember('20', 20)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });

    it('getMemberTest - NOT_FOUND_MEMBER(MEMBER)', async () => {
      const mockMember = new Member();
      mockMember.authority = AuthorityEnum.MANAGER;

      const mockUser = new Users();
      mockUser.username = '테스트유저';
      mockUser.explanation = '테스트설명';

      (memberDao as MockMemberDao).setMockMember(null);
      (usersDao as MockUsersDao).setMockUser(mockUser);

      await expect(memberService.getMember('20', 20)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });
  });

  describe('withdrawTest', () => {
    it('withdrawTest - SUCCESS', async () => {
      const mockUser = new Users();
      mockUser.username = '테스트유저';

      const mockMember = new Member();
      mockMember.users_id = 20;
      mockMember.authority = AuthorityEnum.MEMBER;

      (memberDao as MockMemberDao).setMockMember(mockMember);
      (usersDao as MockUsersDao).setMockUser(mockUser);

      await memberService.withdraw(20, '20');
      const withdrawMember = await memberDao.findByUsersAndMeetingId(20, 20);

      expect(withdrawMember).toBeNull;
    });

    it('withdrawTest - SUCCESS(OWNER_WITHDRAW)', async () => {
      const ownerUser = new Users();
      ownerUser.username = '모임장 김땡땡';
      const ownerMember = new Member();
      ownerMember.users_id = 50;
      ownerMember.authority = AuthorityEnum.OWNER;

      (memberDao as MockMemberDao).setMockMember(ownerMember);
      (usersDao as MockUsersDao).setMockUser(ownerUser);

      const manageUser = new Users();
      manageUser.username = '매니저 김땡땡';
      const managerMember = new Member();
      managerMember.users_id = 30;
      managerMember.authority = AuthorityEnum.MANAGER;
      managerMember.user = Promise.resolve(manageUser);

      (memberDao as MockMemberDao).setMembers([managerMember]);

      await memberService.withdraw(50, '20');
      const withdrawOwner = await memberDao.findByUsersAndMeetingId(20, 20);

      expect(withdrawOwner).toBeNull();

      const members = await memberDao.findByMeetingId(20);
      const newOwner = members.find((m) => m.authority === AuthorityEnum.OWNER);

      expect(newOwner).toBeDefined();
      expect(newOwner.users_id).toBe(30);
    });

    it('withdrawTest - NOT_EXIST_REQUESTER(USER)', async () => {
      const mockMember = new Member();

      (memberDao as MockMemberDao).setMockMember(mockMember);
      (usersDao as MockUsersDao).setMockUser(null);

      await expect(memberService.withdraw(20, '20')).rejects.toThrow(ErrorMessageType.NOT_EXIST_REQUESTER);
    });

    it('withdraw FAIL - NOT_EXIST_REQUESTER(MEMBER)', async () => {
      const mockUser = new Users();
      mockUser.username = '테스트유저';

      (memberDao as MockMemberDao).setMockMember(null);
      (usersDao as MockUsersDao).setMockUser(mockUser);

      await expect(memberService.withdraw(20, '20')).rejects.toThrow(ErrorMessageType.NOT_EXIST_REQUESTER);
    });
  });

  describe('updateAuthorityTest', () => {
    it('updateAuthority - SUCCESS', async () => {
      const targerMember = new Member();
      targerMember.authority = AuthorityEnum.MEMBER;
      (memberDao as MockMemberDao).setMockMember(targerMember);

      const req = {
        meetingId: '40',
        usersId: 80,
        isManager: true,
      };

      await memberService.updateAuthority(80, req);
      const updatedMember = await memberDao.findByUsersAndMeetingId(80, 40);

      expect(updatedMember.authority).toBe(AuthorityEnum.MANAGER);
    });
  });

  describe('deleteMemberTest', () => {
    it('deleteMember - SUCCESS', async () => {
      const mockMember = new Member();
      mockMember.users_id = 20;
      (memberDao as MockMemberDao).setMockMember(mockMember);

      const req = {
        meetingId: '60',
        memberId: 21,
      };

      await memberService.deleteMember(60, req);
      const deleteMember = await memberDao.findByUsersAndMeetingId(21, 20);

      expect(deleteMember).toBeNull();
    });

    it('deleteMember - NOT_FOUND_MEMBER', async () => {
      (memberDao as MockMemberDao).setMockMember(null);

      const req = {
        meetingId: '70',
        memberId: 21,
      };

      await expect(memberService.deleteMember(70, req)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });
  });

  describe('joinTest', () => {
    it('joinTest - SUCCESS', async () => {
      const mockMeeting = new Meeting();
      mockMeeting.canJoin = false;
      (meetingDao as MockMeetingDao).setMockMeeting(mockMeeting);

      const req = {
        meetingId: '90',
        joinMessage: '모임에 꼭 들어가고 싶습니다.',
      };

      await memberService.join(90, req);
      const joinMember = await memberDao.findByUsersAndMeetingId(20, 20);

      expect(joinMember.authority).toBe(AuthorityEnum.WAITING);
      expect(joinMember.applicationMessage).toBe('모임에 꼭 들어가고 싶습니다.');
    });

    it('joinTest - JOIN_REQUEST_DISABLED', async () => {
      const mockMeeting = new Meeting();
      mockMeeting.canJoin = true;
      (meetingDao as MockMeetingDao).setMockMeeting(mockMeeting);

      const req = {
        meetingId: '30',
        joinMessage: '모임에 꼭 들어가고 싶습니다.',
      };

      await expect(memberService.join(30, req)).rejects.toThrow(ErrorMessageType.JOIN_REQUEST_DISABLED);
    });
  });

  describe('getWaitingListTest', () => {
    it('getWaitingList - SUCCESS', async () => {
      const managerMember = [{ meeting_id: 1, authority: AuthorityEnum.MANAGER } as Member];
      (memberDao as MockMemberDao).setManagerMembers(managerMember);

      const mockMeeting = new Meeting();
      mockMeeting.name = '테스트미팅';
      (meetingDao as MockMeetingDao).setMockMeeting(mockMeeting);

      const result = await memberService.getWaitingList(1);

      expect(result.meetings).toBeDefined();
      expect(result.meetings[0].name).toBe('테스트미팅');
    });

    it('getWaitingList - EMPTY', async () => {
      (memberDao as MockMemberDao).setManagerMembers([]);
      const result = await memberService.getWaitingList(1);

      expect(result.meetings).toHaveLength(0);
    });
  });

  describe('manageMemberJoinTest', () => {
    it('manageMemberJoin - SUCCESS(ACCPECT)', async () => {
      const mockUser = new Users();
      mockUser.username = '테스트유저';

      const waitingMember = new Member();
      waitingMember.authority = AuthorityEnum.WAITING;
      waitingMember.users_id = 20;
      waitingMember.user = Promise.resolve(mockUser);
      (memberDao as MockMemberDao).setMockMember(waitingMember);

      const req = {
        meetingId: '20',
        memberId: 21,
        isAccepted: true,
      };

      await memberService.manageMemberJoin(20, req);
      const updatedMember = await memberDao.findByUsersAndMeetingId(21, 20);

      expect(updatedMember.authority).toBe(AuthorityEnum.MEMBER);
    });

    it('manageMemberJoin - SUCCESS(REJECT)', async () => {
      const mockUser = new Users();
      mockUser.username = '테스트유저';

      const waitingMember = new Member();
      waitingMember.authority = AuthorityEnum.WAITING;
      waitingMember.users_id = 21;
      waitingMember.user = Promise.resolve(mockUser);

      (memberDao as MockMemberDao).setMockMember(waitingMember);

      const req = {
        meetingId: '20',
        memberId: 21,
        isAccepted: false,
      };

      await memberService.manageMemberJoin(20, req);
      const deletedMember = await memberDao.findByUsersAndMeetingId(21, 20);

      expect(deletedMember).toBeNull();
    });
  });
});
