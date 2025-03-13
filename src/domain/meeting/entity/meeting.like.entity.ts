import { BaseEntity } from '@root/domain/common/base.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Users } from '@root/domain/user/entity/users.entity';

@Entity()
export class MeetingLike extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'meeting_like_id',
  })
  id: number;

  @Column()
  isLikedYn: boolean;

  @Column({
    name: 'users_id',
  })
  userId: number;

  @Column({
    name: 'meeting_id',
  })
  meetingId: number;

  @ManyToOne(() => Meeting, (meeting) => meeting.meetingLikes, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @ManyToOne(() => Users, (user) => user.meetingLikes, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create(meetingId: number, userId: number): MeetingLike {
    const meetingLike = new MeetingLike();
    meetingLike.meetingId = meetingId;
    meetingLike.userId = userId;
    meetingLike.isLikedYn = false;
    return meetingLike;
  }
}
