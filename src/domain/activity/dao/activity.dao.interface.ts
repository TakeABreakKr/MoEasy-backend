import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';

export interface ActivityDao {
  findByActivityId(activity_id: number): Promise<Activity | null>;
  findAllByActivityIds(activity_ids: number[]): Promise<Activity[]>;
  create(activityCreateVO: ActivityCreateVO): Promise<Activity>;
  update(activity: Activity): Promise<void>;
  findByMeetingId(meeting_id: number): Promise<Activity[]>;
  delete(activity_id: number): Promise<void>;
}
