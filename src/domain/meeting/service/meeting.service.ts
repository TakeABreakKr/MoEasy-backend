import type { FileService } from '@file/service/file.service';
import type { Meeting } from '../entity/meeting.entity';
import type { MeetingCreateRequest } from '../dto/request/meeting.create.request';
import type { MeetingUpdateRequest } from '../dto/request/meeting.update.request';
import type { MeetingResponse } from '../dto/response/meeting.response';
import type { MeetingListResponse } from '../dto/response/meeting.list.response';
import type { MeetingListMeetingDto } from '../dto/response/meeting.list.meeting.dto';
import type { MeetingThumbnailUpdateRequest } from '../dto/request/meeting.thumbnail.update.request';
import type { Users } from '@domain/user/entity/users.entity';
import type { MeetingMemberDto } from '../dto/response/meeting.member.dto';

import { Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { MeetingUtils } from '@utils/meeting.utils';
import { UsersDao } from '@domain/user/dao/users.dao';
import { KeywordDao } from '../dao/keyword.dao';
import { MeetingDao } from '../dao/meeting.dao';
import { MemberDao } from '../dao/member.dao';
import { Member } from '../entity/member.entity';
import { Keyword } from '../entity/keyword.entity';
import { MeetingService } from './meeting.service.interface';

@Injectable()
export class MeetingServiceImpl implements MeetingService {
  private static padding: string = 'G';

  constructor(
    @Inject('FileService') private fileService: FileService,
    private meetingDao: MeetingDao,
    private memberDao: MemberDao,
    private keywordDao: KeywordDao,
    private usersDao: UsersDao,
  ) {}

  @Transactional()
  public async createMeeting(req: MeetingCreateRequest, requester_id: number): Promise<string> {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(req.thumbnail);
    const meeting: Meeting = await this.meetingDao.create({
      name: req.name,
      explanation: req.explanation,
      limit: req.limit,
      thumbnail: thumbnailPath,
    });

    const keywords: Keyword[] = req.keywords.map((keyword) => {
      return Keyword.create(keyword, meeting.meeting_id);
    });
    await this.keywordDao.saveAll(keywords);

    const members: Member[] = req.members.map((member) => {
      const authority: AuthorityEnumType = member === requester_id ? AuthorityEnum.OWNER : AuthorityEnum.INVITED;
      return Member.create({
        authority,
        meeting_id: meeting.meeting_id,
        users_id: member,
      });
    });
    await this.memberDao.saveAll(members);

    return MeetingUtils.transformMeetingIdToString(meeting.meeting_id);
  }

  @Transactional()
  public async updateMeeting(request: MeetingUpdateRequest) {
    if (!request.name && !request.limit && !request.explanation) {
      throw new Error('Invalid Request');
    }

    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(request.meeting_id);

    const meeting: Meeting | null = await this.meetingDao.findById(meetingId);
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
  public async updateMeetingThumbnail(request: MeetingThumbnailUpdateRequest) {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(request.thumbnail);

    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(request.meetingId);
    const meeting: Meeting = await this.meetingDao.findById(meetingId);

    meeting.thumbnail = thumbnailPath;
    await this.meetingDao.update(meeting);
  }

  public async getMeeting(meeting_id: string): Promise<MeetingResponse> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const meeting: Meeting | null = await this.meetingDao.findById(meetingId);
    if (!meeting) {
      throw new Error('wrong meeting id requested');
    }

    return this.toGetMeetingResponse(meeting);
  }

  public async getMeetingList(usersId?: number, authorities?: AuthorityEnumType[]): Promise<MeetingListResponse> {
    const meetings: Meeting[] = await this.meetingDao.findAll();
    const meetingList: MeetingListMeetingDto[] = meetings.map((meeting) => {
      return {
        meetingId: MeetingUtils.transformMeetingIdToString(meeting.meeting_id),
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
        MeetingUtils.transformMeetingIdToInteger(meeting.meetingId),
      );
      meeting.authority = member.authority;
    }

    return {
      meetingList: meetingList.filter((meeting) => {
        return meeting.authority && authorities.includes(meeting.authority);
      }),
    };
  }

  private async toGetMeetingResponse(meeting: Meeting): Promise<MeetingResponse> {
    const members: Member[] = await this.memberDao.findByMeetingId(meeting.meeting_id);
    const usersIds = members.map((member) => member.users_id);
    const users: Users[] = await this.usersDao.findByIds(usersIds);
    const userMap = new Map<number, Users>();
    users.forEach((user) => {
      userMap.set(user.users_id, user);
    });

    const memberDtos: MeetingMemberDto[] = members.map((member): MeetingMemberDto => {
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
}
