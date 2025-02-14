import { Member } from '@domain/member/entity/member.entity';
import { CreateMemberDto } from '../dto/create.member.dto';
import { AuthorityEnumType } from '@root/enums/authority.enum';

export interface MemberComponent {
  saveAll(members: Member[]): Promise<void>;
  findByMeetingId(meetingId: number): Promise<Member[]>;
  findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null>;
  findByUserId(usersId: number): Promise<Member[]>;
  getMemberCount(meeting_id: number): Promise<number>;
  getMostPopularMeetingIds(): Promise<number[]>;
  findByUsersAndAuthorities(usersId: number, authority: AuthorityEnumType[]): Promise<Member[]>;
  create(createMemberDto: CreateMemberDto): Promise<Member>;
  updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void>;
  deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void>;
}
