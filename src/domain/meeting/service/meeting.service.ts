import type { DataSource } from 'typeorm';
import type { FileService } from '../../../file/service/file.service';
import type { MeetingDao } from '../dao/meeting.dao';
import type { MemberDao } from '../dao/member.dao';
import type { Meeting } from '../entity/meeting.entity';
import type { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import type { UpdateMeetingRequest } from '../dto/request/update.meeting.request';
import type { GetMeetingResponse } from '../dto/response/get.meeting.response';
import type { KeywordDao } from '../dao/keyword.dao';
import type { GetMeetingListResponse } from '../dto/response/get.meeting.list.response';
import type { GetMeetingListMeetingDto } from '../dto/response/get.meeting.list.meeting.dto';
import type { UpdateMeetingThumbnailRequest } from '../dto/request/update.meeting.thumbnail.request';
import type { UsersDao } from '../../user/dao/users.dao';
import type { Users } from '../../user/entity/users.entity';
import type { GetMeetingMemberDto } from '../dto/response/get.meeting.member.dto';

import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { AuthorityEnum, AuthorityEnumType } from '../../../enums/authority.enum';
import { Member } from '../entity/member.entity';
import { Keyword } from '../entity/keyword.entity';

@Injectable()
export class MeetingService {
  private static padding: string = 'G';

  constructor(
    private readonly dataSource: DataSource,
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
    private keywordDao: KeywordDao,
    private usersDao: UsersDao,
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
      return Member.create({
        authority,
        meeting_id: meeting.meeting_id,
        users_id: member,
      });
    });
    await this.memberDao.saveAll(members);

    return this.transformMeetingIdToString(meeting.meeting_id);
  }

  @Transactional()
  public async updateMeeting(request: UpdateMeetingRequest) {
    if (!request.name && !request.limit && !request.explanation) {
      throw new Error('Invalid Request');
    }

    const meetingId = this.transformMeetingIdToInteger(request.meeting_id);

    const meeting: Meeting = await this.meetingDao.findById(meetingId);
    if (!meeting) {
      throw new Error('존재하는 모임이 아닙니다.');
    }

    const name: string = request.name || meeting.name;
    const explanation: string = request.explanation || meeting.explanation;
    const limit: number = request.limit || meeting.limit;
    meeting.updateBasicInfo({ name, explanation, limit });
    await this.meetingDao.update(meeting);
  }

  @Transactional()
  public async updateMeetingThumbnail(request: UpdateMeetingThumbnailRequest) {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(request.thumbnail);

    const meetingId: number = this.transformMeetingIdToInteger(request.meetingId);
    const meeting: Meeting = await this.meetingDao.findById(meetingId);

    meeting.thumbnail = thumbnailPath;
    await this.meetingDao.update(meeting);
  }

  public async getMeeting(meeting_id: string): Promise<GetMeetingResponse> {
    const meetingId: number = this.transformMeetingIdToInteger(meeting_id);
    const meeting: Meeting = await this.meetingDao.findById(meetingId);

    return this.toGetMeetingResponse(meeting);
  }

  public async getMeetingList(usersId?: number, authorities?: AuthorityEnumType[]): Promise<GetMeetingListResponse> {
    const meetings: Meeting[] = await this.meetingDao.findAll();
    const meetingList: GetMeetingListMeetingDto[] = meetings.map((meeting) => {
      return {
        meetingId: this.transformMeetingIdToString(meeting.meeting_id),
        name: meeting.name,
        explanation: meeting.explanation,
      };
    });

    if (!usersId) {
      return {
        meetingList,
      };
    }

    for (const meeting of meetingList) {
      const member: Member = await this.memberDao.findByUsersAndMeetingId(
        usersId,
        this.transformMeetingIdToInteger(meeting.meetingId),
      );
      meeting.authority = member.authority;
    }

    return {
      meetingList: meetingList.filter((meeting) => {
        return meeting.authority && authorities.includes(meeting.authority);
      }),
    };
  }

  private async toGetMeetingResponse(meeting: Meeting): Promise<GetMeetingResponse> {
    const members: Member[] = await this.memberDao.findByMeetingId(meeting.meeting_id);
    const usersIds = members.map((member) => member.users_id);
    const users: Users[] = await this.usersDao.findByIds(usersIds);
    const userMap = new Map<number, Users>();
    users.forEach((user) => {
      userMap.set(user.users_id, user);
    });

    const memberDtos: GetMeetingMemberDto[] = members.map((member): GetMeetingMemberDto => {
      const user: Users = userMap.get(member.users_id);
      return {
        username: user.nickname,
        authority: member.authority,
      };
    });

    return {
      name: meeting.name,
      explanation: meeting.explanation,
      limit: meeting.limit,
      thumbnail: meeting.thumbnail,
      members: memberDtos,
    };
  }

  private transformMeetingIdToString(meeting_id: number): string {
    return meeting_id.toString(16).replaceAll('0', MeetingService.padding);
  }

  private transformMeetingIdToInteger(meetingId: string): number {
    return parseInt(meetingId.replaceAll(MeetingService.padding, '0'), 16);
  }
}
