import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entity/schedule.entity';
import { Member } from './member.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  meeting_id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'integer',
    default: 10,
  })
  limit: number;

  @OneToMany(() => Schedule, (schedule) => schedule.meeting)
  schedules: Promise<Schedule[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;
}
