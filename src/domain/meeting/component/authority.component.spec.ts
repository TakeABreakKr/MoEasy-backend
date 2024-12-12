import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '../dao/member.dao.interface';
import { AuthorityEnum, AuthorityEnumType, MANAGING_AUTHORITIES } from '@root/enums/authority.enum';
import { Member } from '../entity/member.entity';
import { AuthorityComponent } from './authority.component.interface';
import { AuthorityComponentImpl } from './authority.component';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@root/enums/error.message.enum';

class MockMemberDao implements MemberDao {
  private mockMember: Member | null = null;

  setMockMember(member: Member | null) {
    this.mockMember = member;
  }

  async findByUsersAndMeetingId(): Promise<Member | null> {
    return this.mockMember;
  }

  async saveAll(): Promise<void> {}
  async updateAuthority(): Promise<void> {}
  async deleteByUsersAndMeetingId(): Promise<void> {}
  async create(): Promise<Member> {
    return new Member();
  }
  async findByUserId(): Promise<Member[]> {
    return [];
  }
  async findByUsersAndAuthorities(): Promise<Member[]> {
    return [];
  }
  async findByMeetingId(): Promise<Member[]> {
    return [];
  }
}

describe('AuthorityComponent', () => {
  let authorityComponent: AuthorityComponent;
  let mockMemberDao: MockMemberDao;

  beforeEach(async () => {
    mockMemberDao = new MockMemberDao();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MemberDao',
          useValue: mockMemberDao,
        },
        {
          provide: 'AuthorityComponent',
          useClass: AuthorityComponentImpl,
        },
      ],
    }).compile();
    authorityComponent = module.get<AuthorityComponent>('AuthorityComponent');
  });

  it('validateAuthorityTest - SUCCESS ', async () => {
    const requester_id = 100;
    const meetingId = 100;
    const validAuthorities: AuthorityEnumType[] = MANAGING_AUTHORITIES;

    const mockMember = new Member();
    mockMember.authority = AuthorityEnum.MANAGER;
    mockMemberDao.setMockMember(mockMember);

    await expect(
      authorityComponent.validateAuthority(requester_id, meetingId, validAuthorities),
    ).resolves.not.toThrow();
  });

  it('validateAuthorityTest - NOT_FOUND_MEMBER ', async () => {
    const requester_id = 200;
    const meetingId = 200;
    const validAuthorities: AuthorityEnumType[] = MANAGING_AUTHORITIES;

    mockMemberDao.setMockMember(null);

    await expect(authorityComponent.validateAuthority(requester_id, meetingId, validAuthorities)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER),
    );
  });

  it('validateAuthorityTest - UNAUTHORIZED_ACCESS ', async () => {
    const requester_id = 300;
    const meetingId = 300;
    const validAuthorities: AuthorityEnumType[] = [AuthorityEnum.MANAGER];

    const mockMember = new Member();
    mockMember.authority = AuthorityEnum.MEMBER;
    mockMemberDao.setMockMember(mockMember);

    await expect(authorityComponent.validateAuthority(requester_id, meetingId, validAuthorities)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS),
    );
  });
});
