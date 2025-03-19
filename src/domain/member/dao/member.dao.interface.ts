import { AuthorityEnumType } from '@enums/authority.enum';
import { Member } from '@domain/member/entity/member.entity';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

export interface MemberDao {
  saveAll(members: Member[]): Promise<void>;
  findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null>;
  findByMeetingId(meetingId: number): Promise<Member[]>;
  findByUsersAndAuthorities(userId: number, authority: AuthorityEnumType[]): Promise<Member[]>;
  findByUserId(userId: number): Promise<Member[]>;
  create(createMemberDto: CreateMemberDto): Promise<Member>;
  updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void>;
  deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void>;
  getMemberCountByMeetingId(meetingId: number): Promise<number>;
  getMostPopularMeetingIds(popularMeetingCount: number): Promise<number[]>;
}
