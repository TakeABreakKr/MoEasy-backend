import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';
import { Member } from '@domain/member/entity/member.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberDaoImpl } from '@domain/member/dao/member.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { AuthorityEnum } from '@enums/authority.enum';

class MockMemberRepository extends Repository<Member> {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 10,
      userId: 10,
      authority: AuthorityEnum.OWNER,
    }),
    Member.create({
      meetingId: 5,
      userId: 5,
      authority: AuthorityEnum.MEMBER,
      applicationMessage: '저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.',
    }),
  ];

  async save(members: Member | Member[]): Promise<Member[]> {
    const toSave = Array.isArray(members) ? members : [members];
    this.mockMembers.push(...toSave);
    return toSave;
  }

  async findOneBy(where: FindOptionsWhere<Member>): Promise<Member | null> {
    const member = this.mockMembers.find(
      (member) => member.userId === where.userId && member.meetingId === where.meetingId,
    );

    return member || null;
  }

  async findBy(where: FindOptionsWhere<Member>): Promise<Member[]> {
    if (where.meetingId) {
      return this.mockMembers.filter((member) => member.meetingId === where.meetingId);
    }

    if (where.userId && where.authority instanceof FindOperator) {
      const authorities = where.authority.value;

      return this.mockMembers.filter(
        (member) => member.userId === where.userId && authorities.includes(member.authority),
      );
    }

    if (where.userId) {
      return this.mockMembers.filter((member) => member.userId === where.userId);
    }

    return [];
  }

  async delete(criteria: { userId: number; meetingId: number }): Promise<DeleteResult> {
    const initialLength = this.mockMembers.length;
    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.userId === criteria.userId && member.meetingId === criteria.meetingId),
    );

    return { raw: {}, affected: initialLength - this.mockMembers.length };
  }
}

describe('MemberDao', () => {
  let memberDao: MemberDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'MemberDao', useClass: MemberDaoImpl },
        { provide: getRepositoryToken(Member), useClass: MockMemberRepository },
      ],
    }).compile();

    memberDao = module.get<MemberDao>('MemberDao');
  });

  it('saveAllTest', async () => {
    const newMembers = [
      Member.create({
        userId: 100,
        meetingId: 100,
        authority: AuthorityEnum.MEMBER,
        applicationMessage: '참가 요청1',
      }),
      Member.create({
        userId: 200,
        meetingId: 200,
        authority: AuthorityEnum.MEMBER,
        applicationMessage: '참가 요청2',
      }),
    ];
    await memberDao.saveAll(newMembers);

    const result1 = await memberDao.findByMeetingId(100);
    const result2 = await memberDao.findByMeetingId(200);

    expect(result1[0].userId).toBe(100);
    expect(result1[0].meetingId).toBe(100);
    expect(result1[0].applicationMessage).toBe('참가 요청1');
    expect(result1[0].authority).toBe(AuthorityEnum.MEMBER);

    expect(result2[0].userId).toBe(200);
    expect(result2[0].meetingId).toBe(200);
    expect(result2[0].applicationMessage).toBe('참가 요청2');
    expect(result2[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUsersAndMeetingIdTest', async () => {
    const userId = 5;
    const meetingId = 5;

    const result = await memberDao.findByUsersAndMeetingId(userId, meetingId);

    expect(result.userId).toBe(userId);
    expect(result.meetingId).toBe(meetingId);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
    expect(result.applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('findByMeetingIdTest', async () => {
    const meetingId = 10;
    const userId = 10;
    const result = await memberDao.findByMeetingId(meetingId);

    expect(result[0].meetingId).toBe(meetingId);
    expect(result[0].userId).toBe(userId);
    expect(result[0].authority).toBe(AuthorityEnum.OWNER);
  });

  it('findByUsersAndAuthoritiesTest', async () => {
    const meetingId = 5;
    const userId = 5;

    const result = await memberDao.findByUsersAndAuthorities(userId, [AuthorityEnum.MEMBER]);

    expect(result[0].userId).toBe(userId);
    expect(result[0].meetingId).toBe(meetingId);
    expect(result[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUserIdTest', async () => {
    const meetingId = 10;
    const userId = 10;

    const result = await memberDao.findByUserId(userId);

    expect(result[0].userId).toBe(userId);
    expect(result[0].meetingId).toBe(meetingId);
  });

  it('createTest', async () => {
    const createMemberDto: CreateMemberDto = {
      userId: 1000,
      meetingId: 1000,
      authority: AuthorityEnum.MEMBER,
      applicationMessage: '꼭 뽑아주세요!',
    };

    const result = await memberDao.create(createMemberDto);

    expect(result.userId).toBe(1000);
    expect(result.meetingId).toBe(1000);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
    expect(result.applicationMessage).toBe('꼭 뽑아주세요!');
  });

  it('updateAuthorityTest', async () => {
    const member = await memberDao.findByUsersAndMeetingId(5, 5);
    member.authority = AuthorityEnum.MANAGER;
    await memberDao.updateAuthority(member, AuthorityEnum.MANAGER);

    expect(member.authority).toBe(AuthorityEnum.MANAGER);
  });

  it('deleteByUsersAndMeetingIdTest', async () => {
    const userId = 5;
    const meetingId = 5;

    const beforeDelete = await memberDao.findByUserId(userId);
    expect(beforeDelete.find((member) => member.meetingId === meetingId)).toBeDefined();

    await memberDao.deleteByUsersAndMeetingId(userId, meetingId);

    const afterDelete = await memberDao.findByUserId(userId);
    expect(afterDelete.find((member) => member.meetingId === meetingId)).toBeUndefined();
  });
});
