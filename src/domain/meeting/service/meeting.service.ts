import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { MeetingDao } from '../dao/meeting.dao';
import { FileService } from '../../../file/service/file.service';
import { MemberDao } from '../dao/member.dao';
import { Meeting } from '../entity/meeting.entity';
import { Member } from '../entity/member.entity';
import { AuthorityEnum, AuthorityEnumType } from '../../../enums/authority.enum';

@Injectable()
export class MeetingService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
  ) {}

  @Transactional()
  async createMeeting(
    request: CreateMeetingRequest,
    thumbnail: Express.Multer.File,
    requester_id: number,
  ): Promise<void> {
    const thumbnailPath = this.fileService.uploadFile(thumbnail);
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
}
