import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service.interface';
import { MemberServiceImpl } from './member.service';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { Meeting } from '../entity/meeting.entity';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { Users } from '@root/domain/user/entity/users.entity';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMemberDto } from '../dto/create.member.dto';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { AuthorityComponent } from '@domain/meeting/component/authority.component.interface';

const daoAccessLog: string[] = [];

class MockMeetingDao implements MeetingDao {
  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meeting_id: 80,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 10,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: false,
    }),
    Meeting.createForTest({
      meeting_id: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 10,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    daoAccessLog.push('MeetingDao.findByMeetingId called');

    return this.mockMeetings.find((meeting) => meeting.meeting_id === id);
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
}

class MockMemberDao implements MemberDao {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 80,
      usersId: 80,
      authority: AuthorityEnum.MANAGER,
    }),
    Member.create({
      meetingId: 200,
      usersId: 80,
      authority: AuthorityEnum.MANAGER,
    }),
    Member.create({
      meetingId: 80,
      usersId: 15,
      authority: AuthorityEnum.WAITING,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 80,
      usersId: 200,
      authority: AuthorityEnum.MEMBER,
    }),
    Member.create({
      meetingId: 80,
      usersId: 60,
      authority: AuthorityEnum.OWNER,
    }),
  ];

  async findByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<Member | null> {
    daoAccessLog.push('MemberDao.findByUsersAndMeetingId called');

    const userMap = {
      80: { users_id: 80, username: '테스트 유저1', explanation: '테스트 유저 설명1' },
      60: { users_id: 60, username: '테스트 유저2', explanation: '테스트 유저 설명2' },
      200: { users_id: 200, username: '테스트 유저3', explanation: '테스트 유저 설명3' },
      15: { users_id: 80, username: '테스트 유저4', explanation: '테스트 유저 설명4' },
    };

    const member = this.mockMembers.find((member) => member.users_id === users_id && member.meeting_id === meeting_id);
    if (member) {
      member.user = Promise.resolve(userMap[users_id]);
    }
    return member || null;
  }

  async findByUsersAndAuthorities(users_id: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    daoAccessLog.push('MemberDao.findByUsersAndAuthorities called');

    return this.mockMembers.filter((member) => member.users_id === users_id && authorities.includes(member.authority));
  }

  async findByUserId(users_id: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.users_id === users_id);
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    daoAccessLog.push('MemberDao.findByMeetingId called');

    const members = this.mockMembers.filter((member) => member.meeting_id === meeting_id);
    members.forEach((member) => {
      member.user = Promise.resolve(
        Users.createForTest({
          users_id: member.users_id,
          discord_id: '',
          username: '테스트 유저',
          avatar: '',
          email: '',
          explanation: '테스트 유저 설명',
          settings: {
            allowNotificationYn: true,
          },
        }),
      );
    });
    return members;
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
    daoAccessLog.push('MemberDao.updateAuthority called');

    member.authority = authority;
  }

  async deleteByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<void> {
    daoAccessLog.push('MemberDao.deleteByUsersAndMeetingId called');

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

class MockUsersDao implements UsersDao {
  findById(user_id: number): Promise<Users | null> {
    daoAccessLog.push('UsersDao.findById called');

    const userMap = {
      80: { users_id: 80, username: '테스트 유저1', explanation: '테스트 유저 설명1' },
      60: { users_id: 60, username: '테스트 유저2', explanation: '테스트 유저 설명2' },
      200: { users_id: 200, username: '테스트 유저3', explanation: '테스트 유저 설명3' },
    };

    return userMap[user_id] || null;
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
  async validateAuthority() {
    daoAccessLog.push('AuthorityComponent.validateAuthority called');
  }
}

class MockNotificationComponent implements NotificationComponent {
  async addNotifications() {}

  async addNotification() {
    daoAccessLog.push('addNotifications called');
  }
}

jest.mock('typeorm-transactional', () => ({ Transactional: () => () => {} }));

describe('MemberService', () => {
  let memberService: MemberService;
  let memberDao: MemberDao;

  beforeEach(async () => {
    daoAccessLog.length = 0;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MemberService', useClass: MemberServiceImpl },
        {
          provide: 'UsersDao',
          useClass: MockUsersDao,
        },
        { provide: 'MemberDao', useClass: MockMemberDao },
        { provide: 'MeetingDao', useClass: MockMeetingDao },
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
    memberDao = module.get<MemberDao>('MemberDao');
  });

  describe('getMemberTest', () => {
    it('getMemberTest - SUCCESS', async () => {
      const result = await memberService.getMember('50', 80);

      expect(result).toEqual({
        username: '테스트 유저1',
        explanation: '테스트 유저 설명1',
        authority: AuthorityEnum.MANAGER,
      });

      expect(daoAccessLog).toEqual(['MemberDao.findByUsersAndMeetingId called', 'UsersDao.findById called']);
    });

    it('getMemberTest - NOT_FOUND_MEMBER(USER & MEMBER)', async () => {
      await expect(memberService.getMember('999', 999)).rejects.toThrow(ErrorMessageType.NOT_FOUND_MEMBER);
    });
  });

  describe('withdrawTest', () => {
    it('withdrawTest - SUCCESS', async () => {
      await memberService.withdraw(200, '50');
      const withdrawMember = await memberDao.findByUsersAndMeetingId(200, 200);

      expect(withdrawMember).toBeNull();

      expect(daoAccessLog).toEqual([
        'UsersDao.findById called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.deleteByUsersAndMeetingId called',
        'MemberDao.findByMeetingId called',
        'MemberDao.findByUsersAndMeetingId called',
      ]);
    });

    it('withdrawTest - SUCCESS(OWNER_WITHDRAW)', async () => {
      await memberService.withdraw(60, '50');
      const withdrawOwner = await memberDao.findByUsersAndMeetingId(60, 80);

      expect(withdrawOwner).toBeNull();

      const members = await memberDao.findByMeetingId(80);
      const newOwner = members.find((member) => member.authority === AuthorityEnum.OWNER);

      expect(newOwner.users_id).toBe(80);
      expect(newOwner.meeting_id).toBe(80);
      expect(newOwner.authority).toBe(AuthorityEnum.OWNER);

      expect(daoAccessLog).toEqual([
        'UsersDao.findById called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.deleteByUsersAndMeetingId called',
        'MemberDao.findByMeetingId called',
        'MemberDao.updateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.findByMeetingId called',
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
        usersId: 200,
        isManager: true,
      };

      await memberService.updateAuthority(80, req);
      const updatedMember = await memberDao.findByUsersAndMeetingId(200, 80);

      expect(updatedMember.authority).toBe(AuthorityEnum.MANAGER);
      expect(updatedMember.users_id).toBe(200);
      expect(updatedMember.meeting_id).toBe(80);

      expect(daoAccessLog).toEqual([
        'AuthorityComponent.validateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.updateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
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
      const deleteMember = await memberDao.findByUsersAndMeetingId(200, 80);

      expect(deleteMember).toBeNull();

      expect(daoAccessLog).toEqual([
        'AuthorityComponent.validateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.deleteByUsersAndMeetingId called',
        'MemberDao.findByUsersAndMeetingId called',
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
      const joinMember = await memberDao.findByUsersAndMeetingId(20, 80);

      expect(joinMember.authority).toBe(AuthorityEnum.WAITING);
      expect(joinMember.applicationMessage).toBe('모임에 꼭 들어가고 싶습니다.');

      expect(daoAccessLog).toEqual(['MeetingDao.findByMeetingId called', 'MemberDao.findByUsersAndMeetingId called']);
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

      expect(daoAccessLog).toEqual([
        'MemberDao.findByUsersAndAuthorities called',
        'MemberDao.findByMeetingId called',
        'MemberDao.findByMeetingId called',
        'MeetingDao.findByMeetingId called',
        'MeetingDao.findByMeetingId called',
      ]);
    });

    it('getWaitingList - EMPTY', async () => {
      const result = await memberService.getWaitingList(999);

      expect(result.meetings).toHaveLength(0);
    });
  });

  describe('manageMemberJoinTest', () => {
    it('manageMemberJoin - SUCCESS(ACCEPT)', async () => {
      const req = {
        meetingId: '50',
        memberId: 15,
        isAccepted: true,
      };

      await memberService.manageMemberJoin(80, req);
      const updatedMember = await memberDao.findByUsersAndMeetingId(15, 80);

      expect(updatedMember.authority).toBe(AuthorityEnum.MEMBER);
      expect(updatedMember.users_id).toBe(15);
      expect(updatedMember.meeting_id).toBe(80);
      expect(updatedMember.applicationMessage).toBe('꼭 가입하고 싶습니다.');

      expect(daoAccessLog).toEqual([
        'AuthorityComponent.validateAuthority called',
        'AuthorityComponent.validateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.updateAuthority called',
        'MemberDao.findByMeetingId called',
        'MemberDao.findByUsersAndMeetingId called',
      ]);
    });

    it('manageMemberJoin - SUCCESS(REJECT)', async () => {
      const req = {
        meetingId: '50',
        memberId: 15,
        isAccepted: false,
      };

      await memberService.manageMemberJoin(20, req);
      const deletedMember = await memberDao.findByUsersAndMeetingId(15, 80);

      expect(deletedMember).toBeNull();

      expect(daoAccessLog).toEqual([
        'AuthorityComponent.validateAuthority called',
        'AuthorityComponent.validateAuthority called',
        'MemberDao.findByUsersAndMeetingId called',
        'MemberDao.deleteByUsersAndMeetingId called',
        'addNotifications called',
        'MemberDao.findByUsersAndMeetingId called',
      ]);
    });
  });
});
