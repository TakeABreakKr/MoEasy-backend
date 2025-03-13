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

  async updateLikeStatus(meetingId: number, userId: number, isLikedYn: boolean): Promise<void> {
    await this.meetingLikeRepository.update({ meeting: { id: meetingId }, user: { id: userId } }, { isLikedYn });
  }

  async findByMeetingIdAndUsers(meetingId: number, userId: number): Promise<MeetingLike | null> {
    return this.meetingLikeRepository.findOneBy({
      meeting: { id: meetingId },
      user: { id: userId },
    });
  }

  async likeStatus(meetingId: number, userId: number): Promise<boolean> {
    const meetingLike = await this.meetingLikeRepository.findOneBy({
      meeting: { id: meetingId },
      user: { id: userId },
    });
    return meetingLike?.isLikedYn || false;
  }
}
