import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';

export interface MeetingLikeDao {
  create(meetingId: number, userId: number): Promise<void>;
  updateLikeStatus(meetingId: number, userId: number, isLikeYn: boolean): Promise<void>;
  findByMeetingIdAndUsers(meetingId: number, userId: number): Promise<MeetingLike | null>;
  likeStatus(meetingId: number, userId: number): Promise<boolean>;
  findAllLikedMeetingsByUserId(userId: number): Promise<MeetingLike[]>;
}
