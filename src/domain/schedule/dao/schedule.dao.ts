import type { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entity/schedule.entity';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';

@Injectable()
export class ScheduleDao {
  constructor(@InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>) {}

  async findById(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOneBy({ schedule_id: id });
  }

  async create(scheduleCreateVO: ScheduleCreateVO): Promise<Schedule> {
    const schedule = Schedule.create(scheduleCreateVO);
    await this.scheduleRepository.save(schedule);
    return schedule;
  }

  async update(schedule: Schedule) {
    await this.scheduleRepository.save(schedule);
  }

  async findByMeetingId(meeting_id: number) {
    return this.scheduleRepository.findBy({ meeting_id });
  }
}
