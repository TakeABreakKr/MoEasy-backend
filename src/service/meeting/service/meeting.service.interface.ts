import { MeetingCreateRequest } from '@service/meeting/dto/request/meeting.create.request';
import { MeetingUpdateRequest } from '@service/meeting/dto/request/meeting.update.request';
import { MeetingThumbnailUpdateRequest } from '@service/meeting/dto/request/meeting.thumbnail.update.request';
import { MeetingResponse } from '@service/meeting/dto/response/meeting.response';
import { AuthorityEnumType } from '@enums/authority.enum';
import { MeetingListResponse } from '@service/meeting/dto/response/meeting.list.response';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';

export interface MeetingService {
  createMeeting(req: MeetingCreateRequest, requesterId: number): Promise<string>;
  updateMeeting(request: MeetingUpdateRequest, requesterId: number): Promise<void>;
  updateMeetingThumbnail(request: MeetingThumbnailUpdateRequest, requesterId: number): Promise<void>;
  deleteMeeting(meetingId: string, requesterId: number): Promise<void>;
  getMeeting(meetingId: string, requesterId?: number): Promise<MeetingResponse>;
  getMeetingList(
    userId?: number,
    authorities?: AuthorityEnumType[],
    options?: OrderingOptionEnumType,
    onLiked?: boolean,
  ): Promise<MeetingListResponse>;
  likeMeeting(meetingId: string, requesterId: number): Promise<void>;
}
