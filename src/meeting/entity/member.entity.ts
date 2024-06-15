import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../../user/entity/users.entity';
import { Meeting } from './meeting.entity';

@Entity()
export class Member {
  @PrimaryColumn()
  users_id: number;

  @PrimaryColumn()
  meeting_id: number;

  @ManyToOne(() => Users, (user) => user.members, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  @ManyToOne(() => Meeting, (meeting) => meeting.members, {
    nullable: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Member>;
}
