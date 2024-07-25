import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Users } from '@domain/user/entity/users.entity';

@Entity()
export class Participant {
  @PrimaryColumn()
  schedule_id: number;

  @PrimaryColumn()
  users_id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.schedule_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Promise<Schedule>;

  @ManyToOne(() => Users, (users) => users.users_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;
}
