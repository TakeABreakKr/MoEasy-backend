import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { CreateMeetingResponse } from '../dto/response/create.meeting.response';
import { MeetingDao } from '../dao/meeting.dao';

@Injectable()
export class MeetingService {
  constructor(
    private readonly dataSource: DataSource,
    private meetingDao: MeetingDao,
  ) {}

  @Transactional()
  async createMeeting(request: CreateMeetingRequest): Promise<CreateMeetingResponse> {
    await this.meetingDao.create(request.name);
    return new CreateMeetingResponse();
  }
}
