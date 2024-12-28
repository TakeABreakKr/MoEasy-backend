import { DeleteResult, FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberDaoImpl } from './member.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MemberDao } from './member.dao.interface';
import { AuthorityEnum } from '@enums/authority.enum';

class MockMemberRepository extends Repository<Member> {
  private mockMembers: Member[] = [
    Member.create({
      meetingId: 10,
      usersId: 10,
      authority: AuthorityEnum.OWNER,
    }),
    Member.create({
      meetingId: 5,
      usersId: 5,
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
      (member) => member.users_id === where.users_id && member.meeting_id === where.meeting_id,
    );

    return member || null;
  }

  async findBy(where: FindOptionsWhere<Member>): Promise<Member[]> {
    if (where.meeting_id) {
      return this.mockMembers.filter((member) => member.meeting_id === where.meeting_id);
    }

    if (where.users_id && where.authority instanceof FindOperator) {
      const authorities = where.authority.value;

      return this.mockMembers.filter(
        (member) => member.users_id === where.users_id && authorities.includes(member.authority),
      );
    }

    if (where.users_id) {
      return this.mockMembers.filter((member) => member.users_id === where.users_id);
    }

    return [];
  }

  async delete(criteria: { users_id: number; meeting_id: number }): Promise<DeleteResult> {
    const initialLength = this.mockMembers.length;
    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.users_id === criteria.users_id && member.meeting_id === criteria.meeting_id),
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
        usersId: 100,
        meetingId: 100,
        authority: AuthorityEnum.MEMBER,
        applicationMessage: '참가 요청1',
      }),
      Member.create({
        usersId: 200,
        meetingId: 200,
        authority: AuthorityEnum.MEMBER,
        applicationMessage: '참가 요청2',
      }),
    ];
    await memberDao.saveAll(newMembers);

    const result1 = await memberDao.findByMeetingId(100);
    const result2 = await memberDao.findByMeetingId(200);

    expect(result1[0].users_id).toBe(100);
    expect(result1[0].meeting_id).toBe(100);
    expect(result1[0].applicationMessage).toBe('참가 요청1');
    expect(result1[0].authority).toBe(AuthorityEnum.MEMBER);

    expect(result2[0].users_id).toBe(200);
    expect(result1[0].meeting_id).toBe(100);
    expect(result2[0].applicationMessage).toBe('참가 요청2');
    expect(result1[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUsersAndMeetingIdTest', async () => {
    const usersId = 5;
    const meetingId = 5;

    const result = await memberDao.findByUsersAndMeetingId(usersId, meetingId);

    expect(result.users_id).toBe(usersId);
    expect(result.meeting_id).toBe(meetingId);
    expect(result.authority).toBe(AuthorityEnum.MEMBER);
    expect(result.applicationMessage).toBe('저는 이 프로젝트 모임에 꼭 가입하고 싶습니다.');
  });

  it('findByMeetingIdTest', async () => {
    const result = await memberDao.findByMeetingId(10);

    expect(result[0].meeting_id).toBe(10);
    expect(result[0].users_id).toBe(10);
    expect(result[0].authority).toBe(AuthorityEnum.OWNER);
  });

  it('findByUsersAndAuthoritiesTest', async () => {
    const result = await memberDao.findByUsersAndAuthorities(5, [AuthorityEnum.MEMBER]);

    expect(result[0].users_id).toBe(5);
    expect(result[0].meeting_id).toBe(5);
    expect(result[0].authority).toBe(AuthorityEnum.MEMBER);
  });

  it('findByUserIdTest', async () => {
    const result = await memberDao.findByUserId(10);

    expect(result[0].users_id).toBe(10);
    expect(result[0].meeting_id).toBe(10);
  });

  it('createTest', async () => {
    const props = {
      usersId: 1000,
      meetingId: 1000,
      authority: AuthorityEnum.MEMBER,
      updateAt: null,
      applicationMessage: '꼭 뽑아주세요!',
    };

    const result = await memberDao.create(props);

    expect(result.users_id).toBe(1000);
    expect(result.meeting_id).toBe(1000);
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
    const usersId = 5;
    const meetingId = 5;

    const beforeDelete = await memberDao.findByUserId(usersId);
    expect(beforeDelete.find((member) => member.meeting_id === meetingId)).toBeDefined();

    await memberDao.deleteByUsersAndMeetingId(usersId, meetingId);

    const afterDelete = await memberDao.findByUserId(usersId);
    expect(afterDelete.find((member) => member.meeting_id === meetingId)).toBeUndefined();
  });
});
