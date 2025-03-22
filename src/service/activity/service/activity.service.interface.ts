import { ActivityCreateRequest } from '@service/activity/dto/request/activity.create.request';
import { ActivityListResponse } from '@service/activity/dto/response/activity.list.response';
import { ActivityUpdateRequest } from '@service/activity/dto/request/activity.update.request';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ActivityStatusEnumType } from '@enums/activity.status.enum';
import { ActivityResponse } from '@service/activity/dto/response/activity.response';
import { ActivityParticipantRequest } from '@service/activity/dto/request/activity.participant.request';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';

export interface ActivityService {
  createActivity(req: ActivityCreateRequest, requesterId: number): Promise<string>;
  updateActivity(req: ActivityUpdateRequest, requesterId: number): Promise<void>;
  getActivity(activityId: number): Promise<ActivityResponse>;
  getActivityList(
    requesterId: number,
    status: ActivityStatusEnumType[],
    options: OrderingOptionEnumType,
    meetingId?: string,
  ): Promise<ActivityListResponse>;
  cancelActivity(requesterId: number, req: ActivityParticipantRequest): Promise<void>;
  joinActivity(requesterId: number, req: ActivityParticipantRequest): Promise<void>;
  delete(requesterId: number, req: ActivityDeleteRequest): Promise<void>;
}
