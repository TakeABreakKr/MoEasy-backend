import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entity/schedule.entity';
import { Member } from './member.entity';

@Entity()
export class Meeting {
  @PrimaryGeneratedColumn()
  meeting_id: number;

  @Column({
    nullable: false,
    length: 18,
  })
  name: string;

  @Column()
  explanation: string;

  @Column({
    type: 'integer',
    default: 10,
  })
  limit: number;

  @Column()
  thumbnail: string;

  @OneToMany(() => Schedule, (schedule) => schedule.meeting)
  schedules: Promise<Schedule[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;

  async getSchedules(): Promise<Schedule[]> {
    return this.schedules;
  }

  async getMembers(): Promise<Member[]> {
    return this.members;
  }
}
