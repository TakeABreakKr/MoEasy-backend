import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '../dao/member.dao.interface';
import { AuthorityEnum } from '@enums/authority.enum';
import { Member } from '../entity/member.entity';
import { AuthorityComponent } from './authority.component.interface';
import { AuthorityComponentImpl } from './authority.component';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

class MockMemberDao implements MemberDao {
  private mockMember: Member[];

  constructor() {
    this.mockMember = [
      Member.create({
        meetingId: 1,
        usersId: 1,
        authority: AuthorityEnum.OWNER,
      }),
      Member.create({
        meetingId: 3,
        usersId: 3,
        authority: AuthorityEnum.MEMBER,
      }),
    ];
  }

  async create(dto: CreateMemberDto): Promise<Member> {
    return Member.create(dto);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    const member: Member = this.mockMember.find(
      (member: Member) => member.users_id === usersId && member.meeting_id === meetingId,
    );
    return member ? member : null;
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
  });

  it('validateAuthorityTest - SUCCESS ', async () => {
    await expect(authorityComponent.validateAuthority(1, 1, [AuthorityEnum.OWNER])).resolves.not.toThrow();
  });

  it('validateAuthorityTest - NOT_FOUND_MEMBER ', async () => {
    await expect(authorityComponent.validateAuthority(100, 100)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER),
    );
  });

  it('validateAuthorityTest - UNAUTHORIZED_ACCESS ', async () => {
    await expect(authorityComponent.validateAuthority(3, 3)).rejects.toThrow(
      new BadRequestException(ErrorMessageType.UNAUTHORIZED_ACCESS),
    );
  });
});
