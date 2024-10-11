import { MemberSearchResponse } from '@domain/meeting/dto/response/member.search.response';
import { MemberInviteRequest } from '@domain/meeting/dto/request/member.invite.request';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberAuthorityModifyRequest } from '@domain/meeting/dto/request/member.authority.modify.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  get(meeting_id: string, user_id: number): Promise<MemberResponse>;
  withdraw(requester_id: number, meeting_id: string): Promise<void>;
  modifyAuthority(requester_id: number, request: MemberAuthorityModifyRequest): Promise<void>;
  delete(requester_id: number, request: MemberDeleteRequest): Promise<void>;
  invite(requester_id: number, request: MemberInviteRequest): Promise<string>;
  accept(requester_id: number, usersId: number, meetingId: string): Promise<void>;
  approve(requesterId: number, usersId: number, meetingId: string): Promise<void>;
}
