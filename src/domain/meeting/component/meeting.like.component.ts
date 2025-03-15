import { Inject } from '@nestjs/common';
import { MeetingLikeDao } from '@domain/meeting/dao/meeting.like.dao.interface';
import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';

export class MeetingLikeComponentImpl implements MeetingLikeComponentImpl {
  constructor(@Inject('MeetingLikeDao') private meetingLikeDao: MeetingLikeDao) {}

  public async create(meetingId: number, userId: number): Promise<void> {
    await this.meetingLikeDao.create(meetingId, userId);
  }

  public async updateLikeStatus(meetingId: number, userId: number, isLikeYn: boolean): Promise<void> {
    await this.meetingLikeDao.updateLikeStatus(meetingId, userId, isLikeYn);
  }

  public async findByMeetingIdAndUserId(meetingId: number, userId: number): Promise<MeetingLike | null> {
    return this.meetingLikeDao.findByMeetingIdAndUserId(meetingId, userId);
  }

  public async likeStatus(meetingId: number, userId: number): Promise<boolean> {
    return this.meetingLikeDao.likeStatus(meetingId, userId);
  }

  public async findAllLikedMeetingsByUserId(userId: number): Promise<MeetingLike[]> {
    return this.meetingLikeDao.findAllLikedMeetingsByUserId(userId);
  }

  public async getLikeCountByMeetingId(meetingId: number): Promise<number> {
    return this.meetingLikeDao.getLikeCountByMeetingId(meetingId);
  }
}
