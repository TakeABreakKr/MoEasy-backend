import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { CreateMeetingResponse } from '../dto/response/create.meeting.response';
import { MeetingDao } from '../dao/meeting.dao';
import { FileService } from '../../../file/service/file.service';

@Injectable()
export class MeetingService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
  ) {}

  @Transactional()
  async createMeeting(request: CreateMeetingRequest, thumbnail: Express.Multer.File): Promise<CreateMeetingResponse> {
    const thumbnailPath = this.fileService.uploadFile(thumbnail);
    await this.meetingDao.create(request.name, request.limit, thumbnailPath);
    return new CreateMeetingResponse();
  }
}
