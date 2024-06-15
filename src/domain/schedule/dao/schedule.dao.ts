import type { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from '../entity/schedule.entity';

@Injectable()
export class ScheduleDao {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
  ) {}

  async findById(id: number): Promise<Schedule | null> {
    return this.scheduleRepository.findOneBy({ schedule_id: id });
  }
}
