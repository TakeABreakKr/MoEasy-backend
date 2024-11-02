import { MemberSearchResponse } from '@domain/meeting/dto/response/member.search.response';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { MemberJoinRequest } from '@domain/meeting/dto/request/member.join.request';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberWaitingListResponse } from '@domain/meeting/dto/response/member.waiting.list.response';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  getMember(meeting_id: string, user_id: number): Promise<MemberResponse>;
  withdraw(requester_id: number, meeting_id: string): Promise<void>;
  updateAuthority(requester_id: number, request: MemberAuthorityUpdateRequest): Promise<void>;
  deleteMember(requester_id: number, request: MemberDeleteRequest): Promise<void>;
  join(requester_id: number, request: MemberJoinRequest): Promise<void>;
  getWaitingList(requester_id: number): Promise<MemberWaitingListResponse>;
  manageMemberJoin(requester_id: number, request: MemberJoinManageRequest): Promise<void>;
}
