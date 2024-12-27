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

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { MeetingUtils } from '@utils/meeting.utils';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { KeywordDao } from '../dao/keyword.dao.interface';
import { MeetingDao } from '../dao/meeting.dao.interface';
import { MemberDao } from '../dao/member.dao.interface';
import { Member } from '../entity/member.entity';
import { Keyword } from '../entity/keyword.entity';
import { MeetingService } from './meeting.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { SortUtils } from '@utils/sort.utils';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { AuthorityComponent } from '@domain/meeting/component/authority.component.interface';

type lineSeperatorFunctionType = (content: string) => string;

@Injectable()
export class MeetingServiceImpl implements MeetingService {
  constructor(
    @Inject('FileService') private fileService: FileService,
    @Inject('MeetingDao') private meetingDao: MeetingDao,
    @Inject('MemberDao') private memberDao: MemberDao,
    @Inject('KeywordDao') private keywordDao: KeywordDao,
    @Inject('UsersDao') private usersDao: UsersDao,
    @Inject('AuthorityComponent') private authorityComponent: AuthorityComponent,
    @Inject('NotificationComponent') private notificationComponent: NotificationComponent,
  ) {}

  @Transactional()
  public async createMeeting(req: MeetingCreateRequest, requester_id: number): Promise<string> {
    if (req.keywords.length > 10) {
      throw new BadRequestException(ErrorMessageType.KEYWORD_LIMIT_EXCEEDED);
    }

    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(req.thumbnail);
    const meeting: Meeting = await this.meetingDao.create({
      name: req.name,
      explanation: req.explanation,
      limit: req.limit,
      thumbnail: thumbnailPath,
      canJoin: req.canJoin,
    });

    const keywords: Keyword[] = req.keywords.map((keyword) => {
      if (keyword.length > 10) {
        throw new BadRequestException(ErrorMessageType.INVALID_KEYWORD_LENGTH);
      }
      return Keyword.create(keyword, meeting.meeting_id);
    });
    await this.keywordDao.saveAll(keywords);

    const members: Member[] = req.members.map((member) => {
      const authority: AuthorityEnumType = member === requester_id ? AuthorityEnum.OWNER : AuthorityEnum.MEMBER;
      return Member.create({
        authority,
        meetingId: meeting.meeting_id,
        usersId: member,
      });
    });
    await this.memberDao.saveAll(members);

    const content = meeting.name + ' 모임이 생성되었습니다.';
    const userIdList: number[] = members.map((member) => member.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);
    return MeetingUtils.transformMeetingIdToString(meeting.meeting_id);
  }

  @Transactional()
  public async updateMeeting(request: MeetingUpdateRequest, requester_id: number) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(request.meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId, [AuthorityEnum.OWNER]);

    const meeting: Meeting | null = await this.meetingDao.findByMeetingId(meetingId);
    if (!meeting) {
      throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);
    }

    const name: string = request.name || meeting.name;
    const explanation: string = request.explanation || meeting.explanation;
    const limit: number = request.limit || meeting.limit;
    const canJoin = request.canJoin || meeting.canJoin;

    const userIdList: number[] = (await this.memberDao.findByMeetingId(meetingId)).map((member) => member.users_id);

    const content: string = this.getUpdateMeetingNotificationContent(request, meeting);
    if (content !== '') {
      await this.notificationComponent.addNotifications(content, userIdList);
    }

    meeting.updateBasicInfo({ name, explanation, limit, canJoin });
    await this.meetingDao.update(meeting);
  }

  private getUpdateMeetingNotificationContent(request: MeetingUpdateRequest, meeting: Meeting): string {
    const getLineSeperator: lineSeperatorFunctionType = (content) => (content === '' ? '\n' : '');

    let content = '';
    if (!request.name) {
      content += meeting.name + '모임 이름이 ' + request.name + '으로 변경되었습니다.';
    }
    if (!request.explanation) {
      content += getLineSeperator(content) + meeting.name + '모임 소개가 변경되었습니다.';
    }
    if (!request.limit) {
      content +=
        getLineSeperator(content) + meeting.name + '의 인원 제한이 ' + request.limit + '명으로 변경되었습니다.';
    }
    return content;
  }

  @Transactional()
  public async updateMeetingThumbnail(request: MeetingThumbnailUpdateRequest, requester_id: number) {
    const thumbnailPath: string = await this.fileService.uploadThumbnailFile(request.thumbnail);

    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(request.meetingId);
    await this.authorityComponent.validateAuthority(requester_id, meetingId, [AuthorityEnum.OWNER]);
    const meeting: Meeting = await this.meetingDao.findByMeetingId(meetingId);

    meeting.thumbnail = thumbnailPath;
    await this.meetingDao.update(meeting);

    const content = meeting.name + ' 모임 썸네일이 변경되었습니다.';
    const userIdList: number[] = (await this.memberDao.findByMeetingId(meetingId)).map((member) => member.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);
  }

  @Transactional()
  public async deleteMeeting(meeting_id: string, requester_id: number) {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    await this.authorityComponent.validateAuthority(requester_id, meetingId, [AuthorityEnum.OWNER]);

    const meeting = await this.meetingDao.findByMeetingId(meetingId);
    const content = meeting.name + ' 모임이 삭제되었습니다.';
    const userIdList: number[] = (await this.memberDao.findByMeetingId(meetingId)).map((member) => member.users_id);
    await this.notificationComponent.addNotifications(content, userIdList);

    await this.meetingDao.delete(meetingId);
  }

  public async getMeeting(meeting_id: string): Promise<MeetingResponse> {
    const meetingId: number = MeetingUtils.transformMeetingIdToInteger(meeting_id);
    const meeting: Meeting | null = await this.meetingDao.findByMeetingId(meetingId);
    if (!meeting) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);

    return this.toGetMeetingResponse(meeting);
  }

  public async getMeetingList(
    usersId?: number,
    authorities?: AuthorityEnumType[],
    options?: OrderingOptionEnumType,
  ): Promise<MeetingListResponse> {
    const meetings: Meeting[] = await this.meetingDao.findAll();
    SortUtils.sort<Meeting>(meetings, options);
    const meetingList: MeetingListMeetingDto[] = meetings.map((meeting) => {
      return {
        meetingId: MeetingUtils.transformMeetingIdToString(meeting.meeting_id),
        name: meeting.name,
        explanation: meeting.explanation,
        canJoin: meeting.canJoin,
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
        username: user.username,
        authority: member.authority,
      };
    });

    return {
      name: meeting.name,
      explanation: meeting.explanation,
      limit: meeting.limit,
      thumbnail: meeting.thumbnail,
      members: memberDtos,
      canJoin: meeting.canJoin,
    };
  }
}
