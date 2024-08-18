import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '../../schedule/entity/schedule.entity';
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

  @Column({
    nullable: true //이거 nullable로 처리하는게 정말 맞을까요?
    //이거 왜 최대길이 제한 없어요?
  })
  explanation: string;

  @Column({
    type: 'integer',
    default: 10,
  })
  limit: number;

  @Column()
  thumbnail: string;

  //number을 했는데 왜 굳이 integer을 또 해주는 걸까??

  @OneToMany(() => Keyword, (keyword) => keyword.meeting)
  keywords: Promise<Keyword[]>;

  @OneToMany(() => Schedule, (schedule) => schedule.meeting)
  schedules: Promise<Schedule[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;

  async getKeywords(): Promise<Keyword[]> {
    return this.keywords;
  }

  //다른거 getter는 없어도 되나?

  async getSchedules(): Promise<Schedule[]> {
    return this.schedules;
  }

  async getMembers(): Promise<Member[]> {
    return this.members;
  }

  updateBasicInfo({ name, explanation, limit}: { name: string; explanation: string; limit: number;}) {
    this.name = name;
    this.explanation = explanation;
    this.limit = limit;
  }
}
