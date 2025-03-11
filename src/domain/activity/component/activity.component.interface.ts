import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { Activity } from '@domain/activity/entity/activity.entity';

export interface ActivityComponent {
  create(activityCreateVO: ActivityCreateVO): Promise<Activity>;
  findByActivityId(activityId: number): Promise<Activity | null>;
  update(activity: Activity): Promise<void>;
  findAllByActivityIds(activityIds: number[]): Promise<Activity[]>;
  findByMeetingId(meetingId: number): Promise<Activity[]>;
  getClosingTimeActivities(): Promise<Partial<Activity>[]>;
  delete(activityId: number): Promise<void>;
  getUpcomingActivities(id?: number): Promise<Activity[]>;
}
