import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { AuthorityEnum, AuthorityEnumType } from '../../../enums/authority.enum';
import { FileService } from '../../../file/service/file.service';
import { MeetingDao } from '../dao/meeting.dao';
import { MemberDao } from '../dao/member.dao';
import { Meeting } from '../entity/meeting.entity';
import { Member } from '../entity/member.entity';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { UpdateMeetingRequest } from '../dto/request/update.meeting.request';
import { GetMeetingResponse } from '../dto/response/get.meeting.response';

@Injectable()
export class MeetingService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
  ) {}

  @Transactional()
  async createMeeting(request: CreateMeetingRequest, requester_id: number): Promise<void> {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(request.thumbnail);
    const meeting: Meeting = await this.meetingDao.create(
      request.name,
      request.explanation,
      request.limit,
      thumbnailPath,
    );

    const members = request.members.map((member) => {
      const authority: AuthorityEnumType = member.id === requester_id ? AuthorityEnum.OWNER : AuthorityEnum.INVITED;
      return Member.create(meeting.meeting_id, member.id, authority);
    });
    await this.memberDao.saveAll(members);
  }

  async updateMeeting(request: UpdateMeetingRequest) {
    if (!request.name && !request.limit && !request.explanation) {
      throw new Error('Invalid Request');
    }

    const meeting: Meeting = await this.meetingDao.findById(request.meeting_id);
    if (!meeting) {
      throw new Error('존재하는 모임이 아닙니다.');
    }

    const name: string = request.name || meeting.name;
    const explanation: string = request.explanation || meeting.explanation;
    const limit: number = request.limit || meeting.limit;
    meeting.updateBasicInfo(name, explanation, limit);
    await this.meetingDao.update(meeting);
  }

  async getMeeting(meeting_id: number): Promise<GetMeetingResponse> {
    const meeting: Meeting = await this.meetingDao.findById(meeting_id);

    return this.toGetMeetingResponse(meeting);
  }

  private async toGetMeetingResponse(meeting: Meeting): Promise<GetMeetingResponse> {
    const thumbnail: StreamableFile | null = await this.fileService.getFile(meeting.thumbnail);
    return {
      name: meeting.name,
      explanation: meeting.explanation,
      limit: meeting.limit,
      thumbnail: thumbnail,
    };
  }
}
