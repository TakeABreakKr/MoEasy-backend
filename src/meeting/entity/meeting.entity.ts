import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entity/schedule.entity';
import { Member } from './member.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  meeting_id: number;

  @Column()
  name: string;

  @OneToMany(() => Schedule, (schedule) => schedule.meeting)
  schedules: Promise<Schedule[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;
}
