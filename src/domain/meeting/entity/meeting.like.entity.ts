import { BaseEntity } from '@root/domain/common/base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Users } from '@root/domain/user/entity/users.entity';

@Entity()
@Index(['likedYn'])
export class MeetingLike extends BaseEntity {
  @PrimaryColumn({
    name: 'users_id',
  })
  userId: number;

  @PrimaryColumn({
    name: 'meeting_id',
  })
  meetingId: number;

  @Column()
  likedYn: boolean;

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
    meetingLike.likedYn = true;
    return meetingLike;
  }
}
