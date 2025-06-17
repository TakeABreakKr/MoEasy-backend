import { Test, TestingModule } from '@nestjs/testing';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { Member } from '@domain/member/entity/member.entity';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { AuthorityComponentImpl } from '@domain/member/component/authority.component';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

class MockMemberDao implements MemberDao {
  private mockMember: Member[];

  constructor() {
    this.mockMember = [
      Member.create({
        meetingId: 1,
        userId: 1,
        authority: AuthorityEnum.OWNER,
      }),
      Member.create({
        meetingId: 3,
        userId: 3,
        authority: AuthorityEnum.MEMBER,
      }),
    ];
  }

  async create(dto: CreateMemberDto): Promise<Member> {
    return Member.create(dto);
  }

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    const member: Member = this.mockMember.find(
      (member: Member) => member.userId === userId && member.meetingId === meetingId,
    );
    return member ? member : null;
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.mockMember.filter(
      (member: Member) => userIds.includes(member.userId) && member.meetingId === meetingId,
    );
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

  async getMemberCountByMeetingId(meetingId: number): Promise<number> {
    return this.mockMember.filter((member: Member) => member.meetingId === meetingId).length;
  }

  async getMostPopularMeetingIds(popularMeetingCount: number): Promise<number[]> {
    return this.mockMember.slice(0, popularMeetingCount).map((member: Member) => member.meetingId);
  }

  async countByMeetingIdAndAuthority(meetingId: number, authority: AuthorityEnumType): Promise<number> {
    return this.mockMember.filter((member: Member) => member.meetingId === meetingId && member.authority === authority)
      .length;
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
