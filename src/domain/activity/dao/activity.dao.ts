import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';

@Injectable()
export class ActivityDaoImpl implements ActivityDao {
  constructor(@InjectRepository(Activity) private activityRepository: Repository<Activity>) {}

  async findByActivityId(activity_id: number): Promise<Activity | null> {
    return this.activityRepository.findOneBy({ activity_id });
  }

  async findAllByActivityIds(activityIds: number[]): Promise<Activity[]> {
    return this.activityRepository.findBy({ activity_id: In(activityIds) });
  }

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    const activity = Activity.create(activityCreateVO);
    await this.activityRepository.save(activity);
    return activity;
  }

  async update(activity: Activity): Promise<void> {
    await this.activityRepository.save(activity);
  }

  async findByMeetingId(meeting_id: number): Promise<Activity[]> {
    return this.activityRepository.findBy({ meeting_id });
  }

  async delete(activity_id: number): Promise<void> {
    await this.activityRepository.delete(activity_id);
  }
}
