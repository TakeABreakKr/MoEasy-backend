import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';

@Injectable()
export class MeetingDao {
  constructor(@InjectRepository(Meeting) private meetingRepository: Repository<Meeting>) {}

  async findById(id: number): Promise<Meeting | null> {
    return this.meetingRepository.findOneBy({ meeting_id: id });
  }

  async create(name: string, limit: number, thumbnail: string): Promise<Meeting> {
    const meeting = this.meetingRepository.create({ name, limit, thumbnail });
    await this.meetingRepository.save(meeting);
    return meeting;
  }
}
