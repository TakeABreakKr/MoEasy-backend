import { Member } from '@domain/member/entity/member.entity';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';
import { AuthorityEnumType } from '@root/enums/authority.enum';

export interface MemberComponent {
  saveAll(members: Member[]): Promise<void>;
  findByMeetingId(meetingId: number): Promise<Member[]>;
  findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null>;
  findByUserId(userId: number): Promise<Member[]>;
  getMemberCount(meetingId: number): Promise<number>;
  getMostPopularMeetingIds(): Promise<number[]>;
  findByUsersAndAuthorities(userId: number, authority: AuthorityEnumType[]): Promise<Member[]>;
  create(createMemberDto: CreateMemberDto): Promise<Member>;
  updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void>;
  deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void>;
}
