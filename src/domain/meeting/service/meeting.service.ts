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
import { Keyword } from '../entity/keyword.entity';
import { KeywordDao } from '../dao/keyword.dao';
import { GetMeetingListResponse } from '../dto/response/get.meeting.list.response';
import { GetMeetingListMeetingDto } from '../dto/response/get.meeting.list.meeting.dto';

@Injectable()
export class MeetingService {
  private static padding: string = 'G';

  constructor(
    private readonly dataSource: DataSource,
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
    private keywordDao: KeywordDao,
  ) {}

  @Transactional()
  public async createMeeting(request: CreateMeetingRequest, requester_id: number): Promise<string> {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(request.thumbnail);
    const meeting: Meeting = await this.meetingDao.create(
      request.name,
      request.explanation,
      request.limit,
      thumbnailPath,
    );

    const keywords: Keyword[] = request.keywords.map((keyword) => {
      return Keyword.create(keyword, meeting.meeting_id);
    });
    await this.keywordDao.saveAll(keywords);

    const members = request.members.map((member) => {
      const authority: AuthorityEnumType = member === requester_id ? AuthorityEnum.OWNER : AuthorityEnum.INVITED;
      return Member.create(meeting.meeting_id, member, authority);
    });
    await this.memberDao.saveAll(members);

    return this.transformMeetingId(meeting.meeting_id);
  }

  @Transactional()
  public async updateMeeting(request: UpdateMeetingRequest) {
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

  public async getMeeting(meeting_id: number): Promise<GetMeetingResponse> {
    const meeting: Meeting = await this.meetingDao.findById(meeting_id);

    return this.toGetMeetingResponse(meeting);
  }

  public async getMeetingList(): Promise<GetMeetingListResponse> {
    const meetings: Meeting[] = await this.meetingDao.findAll();
    const meetingList: GetMeetingListMeetingDto[] = meetings.map((meeting) => {
      return {
        meetingId: this.transformMeetingId(meeting.meeting_id),
      };
    });

    return {
      meetingList,
    };
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

  private transformMeetingId(meeting_id: number): string {
    return meeting_id.toString(16).replaceAll('0', MeetingService.padding);
  }
}
