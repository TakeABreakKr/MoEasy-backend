import { In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '../entity/activity.entity';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { Participant } from '@domain/activity/entity/participant.entity';
import { Meeting } from '@domain/meeting/entity/meeting.entity';

@Injectable()
export class ActivityDao {
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

  async update(activity: Activity) {
    await this.activityRepository.save(activity);
  }

  async findByMeetingId(meeting_id: number): Promise<Activity[]> {
    return this.activityRepository.findBy({ meeting_id });
  }

  async delete(activity_id: number) {
    await this.activityRepository.delete(activity_id);
  }

  async getClosingTimeActivities(): Promise<Partial<Activity>[]> {
    const subQuery = this.activityRepository
      .createQueryBuilder()
      .subQuery()
      .select('activity_id', 'activityId')
      .addSelect('COUNT(users_id)', 'participantCount')
      .from(Participant, 'participant')
      .groupBy('activityId')
      .getQuery(); // activityId, participantLimit, participantCount

    return this.activityRepository
      .createQueryBuilder()
      .select(['activity_id', 'activity.name', 'onlineYn', 'addressSido', 'addressSigungu', 'startDate'])
      .addSelect('participantLimit - subQuery.participantCount', 'participantLeft')
      .innerJoin(subQuery, 'subQuery', 'activity.activity_id = subQuery.activityId')
      .innerJoin(Meeting, 'meeting', 'activity.meeting_id = meeting.meeting_id')
      .where('activity.startDate > :now', { now: new Date() })
      .andWhere('meeting.publicYn = 1')
      .andWhere('activity.participantLimit > subQuery.participantCount')
      .orderBy('participantLeft', 'ASC')
      .limit(30)
      .getMany();
  }
}
