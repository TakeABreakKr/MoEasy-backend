import { MemberSearchResponse } from '@service/member/dto/response/member.search.response';
import { MemberAuthorityUpdateRequest } from '@service/member/dto/request/member.authority.update.request';
import { MemberResponse } from '@service/member/dto/response/member.response';
import { MemberJoinManageRequest } from '@service/member/dto/request/member.join.manage.request';
import { MemberJoinRequest } from '@service/member/dto/request/member.join.request';
import { MemberDeleteRequest } from '@service/member/dto/request/member.delete.request';
import { MemberWaitingListResponse } from '@service/member/dto/response/member.waiting.list.response';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  getMember(meetingId: string, userId: number): Promise<MemberResponse>;
  withdraw(requesterId: number, meetingId: string): Promise<void>;
  updateAuthority(requesterId: number, request: MemberAuthorityUpdateRequest): Promise<void>;
  deleteMember(requesterId: number, request: MemberDeleteRequest): Promise<void>;
  join(requesterId: number, request: MemberJoinRequest): Promise<void>;
  getWaitingList(requesterId: number): Promise<MemberWaitingListResponse>;
  manageMemberJoin(requesterId: number, request: MemberJoinManageRequest): Promise<void>;
}
