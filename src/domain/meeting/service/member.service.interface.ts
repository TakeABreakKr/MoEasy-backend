import { MemberSearchResponse } from '@domain/meeting/dto/response/member.search.response';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { MemberApplyRequest } from '@domain/meeting/dto/request/member.apply.request';
import { MemberWaitingListDto } from '@domain/meeting/dto/response/member.waiting.list.dto';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  getMember(meeting_id: string, user_id: number): Promise<MemberResponse>;
  withdraw(requester_id: number, meeting_id: string): Promise<void>;
  updateAuthority(requester_id: number, request: MemberAuthorityUpdateRequest): Promise<void>;
  delete(requester_id: number, request: MemberDeleteRequest): Promise<void>;
  apply(requester_id: number, request: MemberApplyRequest): Promise<void>;
  getWaiting(requester_id: number, meetingId: string): Promise<MemberWaitingListDto[]>;
  manageMemberJoin(requester_id: number, request: MemberJoinManageRequest): Promise<void>;
}
