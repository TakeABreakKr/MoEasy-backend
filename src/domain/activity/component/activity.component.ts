import { Inject, Injectable } from '@nestjs/common';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';

@Injectable()
export class ActivityComponentImpl implements ActivityComponent {
  constructor(@Inject('ActivityDao') private activityDao: ActivityDao) {}

  public async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    return this.activityDao.create(activityCreateVO);
  }

  public async findByActivityId(activityId: number): Promise<Activity | null> {
    return this.activityDao.findByActivityId(activityId);
  }

  public async update(activity: Activity): Promise<void> {
    await this.activityDao.update(activity);
  }

  public async findAllByActivityIds(activityIds: number[]): Promise<Activity[]> {
    return this.activityDao.findAllByActivityIds(activityIds);
  }

  public async findByMeetingId(meetingId: number) {
    return this.activityDao.findByMeetingId(meetingId);
  }

  public async delete(activityId: number): Promise<void> {
    await this.activityDao.delete(activityId);
  }
}
