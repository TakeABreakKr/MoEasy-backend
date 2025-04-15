import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';

export interface ActivityNoticeImageComponent {
  create(activityId: number, attachmentId: number): Promise<ActivityNoticeImage>;
  findByActivityId(activityId: number): Promise<ActivityNoticeImage[]>;
}
