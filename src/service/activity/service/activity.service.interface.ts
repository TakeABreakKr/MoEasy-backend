import { ActivityCreateRequest } from '@service/activity/dto/request/activity.create.request';
import { ActivityListResponse } from '@service/activity/dto/response/activity.list.response';
import { ActivityUpdateRequest } from '@service/activity/dto/request/activity.update.request';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ActivityStatusEnumType } from '@enums/activity.status.enum';
import { ActivityResponse } from '@service/activity/dto/response/activity.response';
import { ActivityWithdrawRequest } from '@service/activity/dto/request/activity.withdraw.request';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';

export interface ActivityService {
  createActivity(req: ActivityCreateRequest, requester_id: number): Promise<string>;
  updateActivity(req: ActivityUpdateRequest, requester_id: number): Promise<void>;
  getActivity(activityId: number): Promise<ActivityResponse>;
  getActivityList(
    requester_id: number,
    status: ActivityStatusEnumType[],
    options: OrderingOptionEnumType,
    meetingId?: string,
  ): Promise<ActivityListResponse>;
  withdraw(requester_id: number, req: ActivityWithdrawRequest): Promise<void>;
  delete(requester_id: number, req: ActivityDeleteRequest): Promise<void>;
}
