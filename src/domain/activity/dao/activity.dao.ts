import { In, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { Participant } from '@domain/activity/entity/participant.entity';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityDao } from '@domain/activity/dao/activity.dao.interface';

@Injectable()
export class ActivityDaoImpl implements ActivityDao {
  private readonly logger = new Logger(ActivityDaoImpl.name);

  private static readonly CLOSING_TIME_ACTIVITIES_LIMIT: number = 30;
  private static readonly UPCOMING_ACTIVITIES_LIMIT: number = 100;

  constructor(@InjectRepository(Activity) private activityRepository: Repository<Activity>) {}

  async findByActivityId(id: number): Promise<Activity | null> {
    return this.activityRepository.findOneBy({ id });
  }

  async findAllByActivityIds(ids: number[]): Promise<Activity[]> {
    return this.activityRepository.findBy({ id: In(ids) });
  }

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    const activity = Activity.create(activityCreateVO);
    await this.activityRepository.save(activity);
    return activity;
  }

  async update(activity: Activity): Promise<void> {
    await this.activityRepository.save(activity);
  }

  async findByMeetingId(meetingId: number): Promise<Activity[]> {
    return this.activityRepository.findBy({ meetingId });
  }

  async delete(activityId: number): Promise<void> {
    await this.activityRepository.delete(activityId);
  }

  async getClosingTimeActivities(): Promise<Partial<Activity>[]> {
    try {
      const subQuery = this.activityRepository
        .createQueryBuilder()
        .subQuery()
        .select('activity_id', 'activityId')
        .addSelect('COUNT(users_id)', 'participantCount')
        .from(Participant, 'participant')
        .groupBy('activityId')
        .getQuery(); // activityId, participantCount

      return this.activityRepository
        .createQueryBuilder('activity')
        .select(['activity_id', 'activity.name', 'onlineYn', 'addressSido', 'addressSigungu', 'startDate'])
        .addSelect('participantLimit - subQuery.participantCount', 'participantLeft')
        .leftJoin(subQuery, 'subQuery', 'activity.activity_id = subQuery.activityId')
        .innerJoin(Meeting, 'meeting', 'activity.meeting_id = meeting.meeting_id')
        .where('activity.startDate > :now', { now: new Date() })
        .andWhere('meeting.publicYn = 1')
        .andWhere('activity.participantLimit > subQuery.participantCount')
        .orderBy('participantLeft', 'ASC')
        .limit(ActivityDaoImpl.CLOSING_TIME_ACTIVITIES_LIMIT)
        .getMany();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  async getUpcomingActivities(id?: number): Promise<Activity[]> {
    try {
      const upcomingDays: number = 10;
      const now = new Date();
      const tenDaysLater = DateTime.now().plus({ days: upcomingDays }).toJSDate();
      if (id) {
        const subQuery = this.activityRepository
          .createQueryBuilder()
          .subQuery()
          .select('activity_id')
          .from(Participant, 'participant')
          .where('users_id = :id', { id })
          .getQuery();

        return this.activityRepository
          .createQueryBuilder('activity')
          .select()
          .where('activity.startDate > :now', { now })
          .andWhere('activity.startDate < :tenDaysLater', { tenDaysLater })
          .andWhere('activity.activity_id IN (' + subQuery + ')')
          .setParameter('id', id)
          .limit(ActivityDaoImpl.UPCOMING_ACTIVITIES_LIMIT)
          .getMany();
      }

      return this.activityRepository
        .createQueryBuilder('activity')
        .select()
        .innerJoin(Meeting, 'meeting', 'activity.meeting_id = meeting.meeting_id')
        .where('activity.startDate > :now', { now })
        .andWhere('activity.startDate < :tenDaysLater', { tenDaysLater })
        .andWhere('meeting.publicYn = 1')
        .limit(ActivityDaoImpl.UPCOMING_ACTIVITIES_LIMIT)
        .getMany();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
}
