import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '../dao/member.dao.interface';
import { AuthorityEnum } from '@root/enums/authority.enum';
import { Member } from '../entity/member.entity';
import { AuthorityComponent } from './authority.component.interface';
import { AuthorityComponentImpl } from './authority.component';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { CreateMemberDto } from '../dto/create.member.dto';

class MockMemberDao implements MemberDao {
  private mockMember: Member[] = [];

  async create({ authority = AuthorityEnum.WAITING, ...props }: CreateMemberDto): Promise<Member> {
    const member = {
      users_id: props.usersId,
      meeting_id: props.meetingId,
      authority,
      applicationMessage: null,
      createdAt: null,
      updatedAt: null,
      user: null,
      meeting: null,
      getUser: null,
      getMeeting: null,
      updateAuthority() {},
    };

    this.mockMember.push(member);
    return member;
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.mockMember.find((member) => member.users_id === usersId && member.meeting_id === meetingId) || null;
  }

  async saveAll(): Promise<void> {}
  async updateAuthority(): Promise<void> {}
  async deleteByUsersAndMeetingId(): Promise<void> {}
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
  let memberDao: MemberDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MemberDao',
          useClass: MockMemberDao,
        },
        {
          provide: 'AuthorityComponent',
          useClass: AuthorityComponentImpl,
        },
      ],
    }).compile();
    authorityComponent = module.get<AuthorityComponent>('AuthorityComponent');
    memberDao = module.get<MemberDao>('MemberDao');
  });

  it('validateAuthorityTest - SUCCESS ', async () => {
    await memberDao.create({
      meetingId: 1,
      usersId: 1,
      authority: AuthorityEnum.OWNER,
    });

    await expect(authorityComponent.validateAuthority(1, 1, [AuthorityEnum.OWNER])).resolves.not.toThrow();
  });

  it('validateAuthorityTest - NOT_FOUND_MEMBER ', async () => {
    await expect(authorityComponent.validateAuthority(100, 100)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER),
    );
  });

  it('validateAuthorityTest - UNAUTHORIZED_ACCESS ', async () => {
    await memberDao.create({
      meetingId: 3,
      usersId: 3,
      authority: AuthorityEnum.MEMBER,
    });

    await expect(authorityComponent.validateAuthority(3, 3)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS),
    );
  });
});
