import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { MemberComponentImpl } from './member.component';
import { MemberComponent } from './member.component.interface';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMemberDto } from '../dto/create.member.dto';

class MockMemberDao implements MemberDao {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 300,
      usersId: 300,
      authority: AuthorityEnum.OWNER,
    }),
    Member.create({
      meetingId: 400,
      usersId: 400,
      authority: AuthorityEnum.MEMBER,
    }),
    Member.create({
      meetingId: 500,
      usersId: 500,
      authority: AuthorityEnum.WAITING,
      applicationMessage: '저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.',
    }),
  ];

  async saveAll(members: Member[]): Promise<void> {
    this.mockMembers.push(...members);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.meeting_id === meetingId);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.mockMembers.find((member) => member.users_id === usersId && member.meeting_id === meetingId) || null;
  }

  async findByUserId(usersId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.users_id === usersId);
  }

  async findByUsersAndAuthorities(users_id: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.users_id === users_id && authority.includes(member.authority));
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = Member.create(createMemberDto);
    this.mockMembers.push(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    const index = this.mockMembers.findIndex(
      (findMember) => findMember.users_id === member.users_id && findMember.meeting_id === member.meeting_id,
    );
    this.mockMembers[index].updateAuthority(authority);
  }

  async deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void> {
    this.mockMembers = this.mockMembers.filter(
      (member) => member.users_id !== usersId && member.meeting_id !== meetingId,
    );
  }
}

describe('KeywordComponent', () => {
  let memberComponent: MemberComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MemberDao',
          useClass: MockMemberDao,
        },
        {
          provide: 'MemberComponent',
          useClass: MemberComponentImpl,
        },
      ],
    }).compile();
    memberComponent = module.get<MemberComponent>('MemberComponent');
  });

  it('saveAllTest', async () => {
    const membersData = [
      Member.create({
        meetingId: 600,
        usersId: 600,
        authority: AuthorityEnum.OWNER,
      }),
      Member.create({
        meetingId: 700,
        usersId: 700,
        authority: AuthorityEnum.MEMBER,
      }),
    ];

    await memberComponent.saveAll(membersData);

    const result1 = await memberComponent.findByMeetingId(600);
    const result2 = await memberComponent.findByMeetingId(700);

    expect(result1[0].users_id).toBe(600);
    expect(result1[0].meeting_id).toBe(600);
    expect(result1[0].authority).toBe(AuthorityEnum.OWNER);

    expect(result2[0].users_id).toBe(700);
    expect(result2[0].meeting_id).toBe(700);
    expect(result2[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByMeetingIdTest', async () => {
    const result = await memberComponent.findByMeetingId(500);

    expect(result[0].users_id).toBe(500);
    expect(result[0].meeting_id).toBe(500);
    expect(result[0].authority).toBe(AuthorityEnum.WAITING);
    expect(result[0].applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('findByUsersAndMeetingIdTest', async () => {
    const result = await memberComponent.findByUsersAndMeetingId(400, 400);

    expect(result.users_id).toBe(400);
    expect(result.meeting_id).toBe(400);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUserIdTest', async () => {
    const result = await memberComponent.findByUserId(300);

    expect(result[0].users_id).toBe(300);
    expect(result[0].meeting_id).toBe(300);
    expect(result[0].authority).toBe(AuthorityEnum.OWNER);
  });

  it('findByUsersAndAuthoritiesTest', async () => {
    const result = await memberComponent.findByUsersAndAuthorities(500, [AuthorityEnum.WAITING]);

    expect(result[0].users_id).toBe(500);
    expect(result[0].meeting_id).toBe(500);
    expect(result[0].authority).toBe(AuthorityEnum.WAITING);
    expect(result[0].applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('createTest', async () => {
    const createMemberDto = {
      meetingId: 600,
      usersId: 600,
      authority: AuthorityEnum.MEMBER,
    };

    const result = await memberComponent.create(createMemberDto);

    expect(result.users_id).toBe(600);
    expect(result.meeting_id).toBe(600);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
  });

  it('updateAuthorityTest', async () => {
    const member = await memberComponent.findByUsersAndMeetingId(400, 400);

    await memberComponent.updateAuthority(member, AuthorityEnum.MANAGER);
    const result = await memberComponent.findByUsersAndMeetingId(400, 400);

    expect(result.users_id).toBe(400);
    expect(result.meeting_id).toBe(400);
    expect(result.authority).toBe(AuthorityEnum.MANAGER);
  });

  it('deleteByUsersAndMeetingIdTest', async () => {
    const usersId = 400;
    const meetingId = 400;

    const beforeDelete = await memberComponent.findByUserId(usersId);
    expect(beforeDelete.find((member) => member.meeting_id === meetingId)).toBeDefined();

    await memberComponent.deleteByUsersAndMeetingId(usersId, meetingId);

    const afterDelete = await memberComponent.findByUserId(usersId);
    expect(afterDelete.find((member) => member.meeting_id === meetingId)).toBeUndefined();
  });
});
