import { Inject } from '@nestjs/common';
import { MeetingLikeDao } from '@domain/meeting/dao/meeting.like.dao.interface';
import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';

export class MeetingLikeComponentImpl implements MeetingLikeComponentImpl {
  constructor(@Inject('MeetingLikeDao') private meetingLikeDao: MeetingLikeDao) {}

  public async create(meetingId: number, userId: number): Promise<void> {
    this.meetingLikeDao.create(meetingId, userId);
  }

  public async updateLikeStatus(meetingId: number, userId: number, isLikeYn: boolean): Promise<void> {
    this.meetingLikeDao.updateLikeStatus(meetingId, userId, isLikeYn);
  }

  public async findByMeetingIdAndUsers(meetingId: number, userId: number): Promise<MeetingLike | null> {
    return this.meetingLikeDao.findByMeetingIdAndUsers(meetingId, userId);
  }

  public async likeStatus(meetingId: number, userId: number): Promise<boolean | null> {
    return this.meetingLikeDao.likeStatus(meetingId, userId);
  }
}
