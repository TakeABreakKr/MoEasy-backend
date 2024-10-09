import { MeetingCreateRequest } from '@domain/meeting/dto/request/meeting.create.request';
import { MeetingUpdateRequest } from '@domain/meeting/dto/request/meeting.update.request';
import { MeetingThumbnailUpdateRequest } from '@domain/meeting/dto/request/meeting.thumbnail.update.request';
import { MeetingResponse } from '@domain/meeting/dto/response/meeting.response';
import { AuthorityEnumType } from '@enums/authority.enum';
import { MeetingListResponse } from '@domain/meeting/dto/response/meeting.list.response';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';

export interface MeetingService {
  createMeeting(req: MeetingCreateRequest, requester_id: number): Promise<string>;
  updateMeeting(request: MeetingUpdateRequest, requester_id: number): Promise<void>;
  updateMeetingThumbnail(request: MeetingThumbnailUpdateRequest, requester_id: number): Promise<void>;
  deleteMeeting(meeting_id: string, requester_id: number): Promise<void>;
  getMeeting(meeting_id: string): Promise<MeetingResponse>;
  getMeetingList(
    userId?: number,
    authorities?: AuthorityEnumType[],
    options?: OrderingOptionEnumType,
  ): Promise<MeetingListResponse>;
}
