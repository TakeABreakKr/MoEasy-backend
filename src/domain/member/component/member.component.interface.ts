import { Member } from '@domain/member/entity/member.entity';

export interface MemberComponent {
  saveAll(members: Member[]): Promise<void>;
  findByMeetingId(meetingId: number): Promise<Member[]>;
  findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null>;
  findByUserId(usersId: number): Promise<Member[]>;
  getMemberCount(meeting_id: number): Promise<number>;
  getMostPopularMeetingIds(): Promise<number[]>;
}
