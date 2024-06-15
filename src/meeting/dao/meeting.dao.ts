import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';

@Injectable()
export class MeetingDao {
  constructor(
    @InjectRepository(Meeting) private meetingRepository: Repository<Meeting>,
  ) {}

  async findById(id: number): Promise<Meeting | null> {
    return this.meetingRepository.findOneBy({ meeting_id: id });
  }
}
