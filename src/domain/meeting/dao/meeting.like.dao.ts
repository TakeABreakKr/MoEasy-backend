import { InjectRepository } from '@nestjs/typeorm';
import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';
import { Repository } from 'typeorm';
import { MeetingLikeDao } from '@domain/meeting/dao/meeting.like.dao.interface';

export class MeetingLikeDaoImpl implements MeetingLikeDao {
  constructor(@InjectRepository(MeetingLike) private meetingLikeRepository: Repository<MeetingLike>) {}

  async create(meetingId: number, userId: number): Promise<void> {
    const meetingLike = MeetingLike.create(meetingId, userId);
    await this.meetingLikeRepository.save(meetingLike);
  }

  async updateLikeStatus(meetingId: number, userId: number, likedYn: boolean): Promise<void> {
    await this.meetingLikeRepository.update({ meeting: { id: meetingId }, user: { id: userId } }, { likedYn });
  }

  async findByMeetingIdAndUserId(meetingId: number, userId: number): Promise<MeetingLike | null> {
    return this.meetingLikeRepository.findOne({
      where: { meeting: { id: meetingId }, user: { id: userId } },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async likeStatus(meetingId: number, userId: number): Promise<boolean> {
    const meetingLike = await this.meetingLikeRepository.findOneBy({
      meeting: { id: meetingId },
      user: { id: userId },
    });
    return meetingLike?.likedYn || false;
  }

  async findAllLikedMeetingsByUserId(userId: number): Promise<MeetingLike[]> {
    return this.meetingLikeRepository.find({
      where: { user: { id: userId }, likedYn: true },
    });
  }

  async getLikeCountByMeetingId(meetingId: number): Promise<number> {
    return this.meetingLikeRepository.countBy({ meeting: { id: meetingId }, likedYn: true });
  }
}
