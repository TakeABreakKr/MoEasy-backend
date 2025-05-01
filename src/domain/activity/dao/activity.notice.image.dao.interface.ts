import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';

export interface ActivityNoticeImageDao {
  create(activityId: number, attachmentId: number, attachmentPath: string): Promise<ActivityNoticeImage>;
  findByActivityId(activityId: number): Promise<ActivityNoticeImage[]>;
}
