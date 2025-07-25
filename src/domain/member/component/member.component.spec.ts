import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { Member } from '@domain/member/entity/member.entity';
import { MemberComponentImpl } from '@domain/member/component/member.component';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

class MockMemberDao implements MemberDao {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 300,
      userId: 300,
      authority: AuthorityEnum.OWNER,
    }),
    Member.create({
      meetingId: 400,
      userId: 400,
      authority: AuthorityEnum.MEMBER,
    }),
    Member.create({
      meetingId: 500,
      userId: 500,
      authority: AuthorityEnum.WAITING,
      applicationMessage: '저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.',
    }),
  ];

  async saveAll(members: Member[]): Promise<void> {
    this.mockMembers.push(...members);
  }

  async countByMeetingIdAndAuthority(meetingId: number, authority: AuthorityEnumType): Promise<number> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId && member.authority === authority).length;
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId);
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => userIds.includes(member.userId) && member.meetingId === meetingId);
  }

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    return this.mockMembers.find((member) => member.userId === userId && member.meetingId === meetingId) || null;
  }

  async findByUserId(userId: number): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.userId === userId);
  }

  async findByUsersAndAuthorities(userId: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.mockMembers.filter((member) => member.userId === userId && authority.includes(member.authority));
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member = Member.create(createMemberDto);
    this.mockMembers.push(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    const index = this.mockMembers.findIndex(
      (findMember) => findMember.userId === member.userId && findMember.meetingId === member.meetingId,
    );
    this.mockMembers[index].updateAuthority(authority);
  }

  async deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void> {
    this.mockMembers = this.mockMembers.filter((member) => member.userId !== userId && member.meetingId !== meetingId);
  }

  async getMemberCountByMeetingId(meetingId: number): Promise<number> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId).length;
  }

  async getMostPopularMeetingIds(popularMeetingCount: number): Promise<number[]> {
    return this.mockMembers.slice(0, popularMeetingCount).map((member) => member.meetingId);
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
        userId: 600,
        authority: AuthorityEnum.OWNER,
      }),
      Member.create({
        meetingId: 700,
        userId: 700,
        authority: AuthorityEnum.MEMBER,
      }),
    ];

    await memberComponent.saveAll(membersData);

    const result1 = await memberComponent.findByMeetingId(600);
    const result2 = await memberComponent.findByMeetingId(700);

    expect(result1[0].userId).toBe(600);
    expect(result1[0].meetingId).toBe(600);
    expect(result1[0].authority).toBe(AuthorityEnum.OWNER);

    expect(result2[0].userId).toBe(700);
    expect(result2[0].meetingId).toBe(700);
    expect(result2[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByMeetingIdTest', async () => {
    const result = await memberComponent.findByMeetingId(500);

    expect(result[0].userId).toBe(500);
    expect(result[0].meetingId).toBe(500);
    expect(result[0].authority).toBe(AuthorityEnum.WAITING);
    expect(result[0].applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('findByUsersAndMeetingIdTest', async () => {
    const meetingId = 400;
    const userId = 400;

    const result = await memberComponent.findByUsersAndMeetingId(meetingId, userId);

    expect(result.userId).toBe(userId);
    expect(result.meetingId).toBe(meetingId);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUserIdTest', async () => {
    const meetingId = 300;
    const userId = 300;

    const result = await memberComponent.findByUserId(meetingId);

    expect(result[0].userId).toBe(userId);
    expect(result[0].meetingId).toBe(meetingId);
    expect(result[0].authority).toBe(AuthorityEnum.OWNER);
  });

  it('findByUsersAndAuthoritiesTest', async () => {
    const meetingId = 500;

    const result = await memberComponent.findByUsersAndAuthorities(meetingId, [AuthorityEnum.WAITING]);

    expect(result[0].userId).toBe(meetingId);
    expect(result[0].meetingId).toBe(meetingId);
    expect(result[0].authority).toBe(AuthorityEnum.WAITING);
    expect(result[0].applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('createTest', async () => {
    const createMemberDto: CreateMemberDto = {
      meetingId: 600,
      userId: 600,
      authority: AuthorityEnum.MEMBER,
    };

    const result = await memberComponent.create(createMemberDto);

    expect(result.userId).toBe(600);
    expect(result.meetingId).toBe(600);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
  });

  it('updateAuthorityTest', async () => {
    const meetingId = 400;
    const userId = 400;

    const member = await memberComponent.findByUsersAndMeetingId(userId, meetingId);

    await memberComponent.updateAuthority(member, AuthorityEnum.MANAGER);
    const result = await memberComponent.findByUsersAndMeetingId(userId, meetingId);

    expect(result.userId).toBe(userId);
    expect(result.meetingId).toBe(meetingId);
    expect(result.authority).toBe(AuthorityEnum.MANAGER);
  });

  it('deleteByUsersAndMeetingIdTest', async () => {
    const userId = 400;
    const meetingId = 400;

    const beforeDelete = await memberComponent.findByUserId(userId);
    expect(beforeDelete.find((member) => member.meetingId === meetingId)).toBeDefined();

    await memberComponent.deleteByUsersAndMeetingId(userId, meetingId);

    const afterDelete = await memberComponent.findByUserId(userId);
    expect(afterDelete.find((member) => member.meetingId === meetingId)).toBeUndefined();
  });
});
