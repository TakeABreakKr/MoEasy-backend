import { MemberSearchResponse } from '@service/member/dto/response/member.search.response';
import { MemberAuthorityUpdateRequest } from '@service/member/dto/request/member.authority.update.request';
import { MemberResponse } from '@service/member/dto/response/member.response';
import { MemberJoinManageRequest } from '@service/member/dto/request/member.join.manage.request';
import { MemberJoinRequest } from '@service/member/dto/request/member.join.request';
import { MemberDeleteRequest } from '@service/member/dto/request/member.delete.request';
import { MemberWaitingListResponse } from '@service/member/dto/response/member.waiting.list.response';

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
