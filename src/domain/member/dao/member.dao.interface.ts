import { AuthorityEnumType } from '@enums/authority.enum';
import { Member } from '../entity/member.entity';
import { CreateMemberDto } from '../dto/create.member.dto';

export interface MemberDao {
  saveAll(members: Member[]): Promise<void>;
  findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null>;
  findByMeetingId(meeting_id: number): Promise<Member[]>;
  findByUsersAndAuthorities(users_id: number, authority: AuthorityEnumType[]): Promise<Member[]>;
  findByUserId(users_id: number): Promise<Member[]>;
  create({ authority, ...props }: CreateMemberDto): Promise<Member>;
  updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void>;
  deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void>;
  getMemberCountByMeetingId(meeting_id: number): Promise<number>;
  getMostPopularMeetingIds(popularMeetingCount: number): Promise<number[]>;
}
