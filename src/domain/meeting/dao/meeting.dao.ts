import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Meeting } from '../entity/meeting.entity';
import { MeetingDao } from './meeting.dao.interface';
import { CreateMeetingDto } from '../dto/create.meeting.dto';

@Injectable()
export class MeetingDaoImpl implements MeetingDao {
  constructor(@InjectRepository(Meeting) private meetingRepository: Repository<Meeting>) {}

  async findByMeetingId(id: number): Promise<Meeting | null> {
    return this.meetingRepository.findOneBy({ meeting_id: id });
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    return this.meetingRepository.findBy({ meeting_id: In(ids) });
  }

  async getNewMeetings(): Promise<Meeting[]> {
    return this.meetingRepository.find({ order: { createdAt: 'DESC' }, take: 30 });
  }

  async create(props: CreateMeetingDto): Promise<Meeting> {
    const meeting = Meeting.create(props);
    await this.meetingRepository.save(meeting);
    return meeting;
  }

  async update(meeting: Meeting): Promise<void> {
    await this.meetingRepository.save(meeting);
  }

  async findAll(): Promise<Meeting[]> {
    return this.meetingRepository.find();
  }

  async delete(id: number): Promise<void> {
    await this.meetingRepository.delete(id);
  }
}
