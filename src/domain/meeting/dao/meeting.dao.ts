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

  async create({
    name,
    explanation,
    limit,
    thumbnail,
  }: {
    name: string;
    explanation: string;
    limit: number;
    thumbnail: string;
  }): Promise<Meeting> {
    const meeting = this.meetingRepository.create({ name, limit, explanation, thumbnail});
    await this.meetingRepository.save(meeting);
    return meeting;
  }

  async update(meeting: Meeting) {
    await this.meetingRepository.save(meeting);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find();
  }
}
