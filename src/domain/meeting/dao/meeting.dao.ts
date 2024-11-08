import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';

@Injectable()
export class MeetingDao {
  constructor(@InjectRepository(Meeting) private meetingRepository: Repository<Meeting>) {}

  async findByMeetingId(id: number): Promise<Meeting | null> {
    return this.meetingRepository.findOneBy({ meeting_id: id });
  }

  async findByMeetingIds(ids: number[]){
    return this.meetingRepository.findBy({ meeting_id: In(ids)});
  }

  async create({
    ...meetingProps
  }: {
    name: string;
    explanation: string;
    limit: number;
    thumbnail: string;
    canJoin: boolean;
  }): Promise<Meeting> {
    const meeting = this.meetingRepository.create({ ...meetingProps });
    await this.meetingRepository.save(meeting);
    return meeting;
  }

  async update(meeting: Meeting) {
    await this.meetingRepository.save(meeting);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find();
  }

  async delete(id: number) {
    await this.meetingRepository.delete(id);
  }
}
