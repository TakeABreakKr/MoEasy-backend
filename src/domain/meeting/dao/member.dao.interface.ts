import { AuthorityEnumType } from '@root/enums/authority.enum';
import { Member } from '../entity/member.entity';

type CreateMemberType = {
  meetingId: number;
  usersId: number;
  authority?: AuthorityEnumType;
  applicationMessage?: string;
};

export interface MemberDao {
  saveAll(members: Member[]): Promise<void>;
  findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null>;
  findByMeetingId(meeting_id: number): Promise<Member[]>;
  findByUsersAndAuthorities(users_id: number, authority: AuthorityEnumType[]): Promise<Member[]>;
  findByUserId(users_id: number): Promise<Member[]>;
  create({ authority, ...props }: CreateMemberType): Promise<Member>;
  updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void>;
  deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void>;
}
