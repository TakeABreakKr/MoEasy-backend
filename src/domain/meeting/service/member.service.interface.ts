import { MemberSearchResponse } from '@domain/meeting/dto/response/member.search.response';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberAuthorityModifyRequest } from '@domain/meeting/dto/request/member.authority.modify.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';
import { MemberManageRequest } from '@domain/meeting/dto/request/member.manage.request';
import { MemberApplyRequest } from '@domain/meeting/dto/request/member.apply.request';
import { MemberWaitingListDto } from '@domain/meeting/dto/response/member.waiting.list.dto';

export interface MemberService {
  search(keyword: string): Promise<MemberSearchResponse>;
  getMember(meeting_id: string, user_id: number): Promise<MemberResponse>;
  withdraw(requester_id: number, meeting_id: string): Promise<void>;
  modifyAuthority(requester_id: number, request: MemberAuthorityModifyRequest): Promise<void>;
  delete(requester_id: number, request: MemberDeleteRequest): Promise<void>;
  apply(requester_id: number, request: MemberApplyRequest): Promise<void>;
  getWaiting(requester_id: number, meetingId: string): Promise<MemberWaitingListDto[]>;
  manageMember(requester_id: number, request: MemberManageRequest): Promise<void>;
}
