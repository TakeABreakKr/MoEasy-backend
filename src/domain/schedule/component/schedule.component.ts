import { Injectable } from '@nestjs/common';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { ScheduleComponent } from '@domain/schedule/component/schedule.component.interface';
import { ScheduleDao } from '@domain/schedule/dao/schedule.dao';

@Injectable()
export class ScheduleComponentImpl implements ScheduleComponent {
  constructor(private scheduleDao: ScheduleDao) {}

  public async create(scheduleCreateVO: ScheduleCreateVO): Promise<Schedule> {
    return this.scheduleDao.create(scheduleCreateVO);
  }

  public async findByScheduleId(schedule_id: number): Promise<Schedule | null> {
    return this.scheduleDao.findByScheduleId(schedule_id);
  }

  public async update(schedule: Schedule) {
    return this.scheduleDao.update(schedule);
  }

  public async findAllByScheduleIds(schedule_ids: number[]): Promise<Schedule[]> {
    return this.scheduleDao.findAllByScheduleIds(schedule_ids);
  }

  public async findByMeetingId(meeting_id: number) {
    return this.scheduleDao.findByMeetingId(meeting_id);
  }

  public async delete(schedule_id: number) {
    return this.scheduleDao.delete(schedule_id);
  }
}
