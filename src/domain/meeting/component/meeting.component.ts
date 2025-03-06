import { Inject, Injectable } from '@nestjs/common';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { MeetingDao } from '@domain/meeting/dao/meeting.dao.interface';
import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';

@Injectable()
export class MeetingComponentImpl implements MeetingComponent {
  constructor(@Inject('MeetingDao') private meetingDao: MeetingDao) {}

  public async findByMeetingId(id: number): Promise<Meeting | null> {
    return this.meetingDao.findByMeetingId(id);
  }

  public async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    return this.meetingDao.findByMeetingIds(ids);
  }

  public async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    return this.meetingDao.create(createMeetingDto);
  }

  public async update(meeting: Meeting): Promise<void> {
    return this.meetingDao.update(meeting);
  }

  public async findAll(): Promise<Meeting[]> {
    return this.meetingDao.findAll();
  }

  public async delete(id: number): Promise<void> {
    await this.meetingDao.delete(id);
  }
}
