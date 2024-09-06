import { MemberSearchResponse } from '@domain/meeting/dto/response/member.search.response';
import { MemberInviteRequest } from '@domain/meeting/dto/request/member.invite.request';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  withdraw(requester_id: number, meeting_id: string): Promise<void>;
  invite(requester_id: number, request: MemberInviteRequest): Promise<string>;
  accept(requester_id: number, usersId: number, meetingId: string): Promise<void>;
}
