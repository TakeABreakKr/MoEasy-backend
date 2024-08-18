import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { Member } from './member.entity';
import { Keyword } from './keyword.entity';

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

  @OneToMany(() => Keyword, (keyword) => keyword.meeting)
  keywords: Promise<Keyword[]>;

  @OneToMany(() => Schedule, (schedule) => schedule.meeting)
  schedules: Promise<Schedule[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;

  async getKeywords(): Promise<Keyword[]> {
    return this.keywords;
  }

  async getSchedules(): Promise<Schedule[]> {
    return this.schedules;
  }

  async getMembers(): Promise<Member[]> {
    return this.members;
  }

  updateBasicInfo({ name, explanation, limit }: { name: string; explanation: string; limit: number }) {
    this.name = name;
    this.explanation = explanation;
    this.limit = limit;
  }
}
