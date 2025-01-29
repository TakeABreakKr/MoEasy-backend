import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { Member } from '@domain/member/entity/member.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { Keyword } from './keyword.entity';
import { CreateMeetingDto } from '../dto/create.meeting.dto';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

@Entity()
export class Meeting extends BaseEntity {
  @PrimaryGeneratedColumn()
  meeting_id: number;

  @Column({
    nullable: false,
    length: 18,
  })
  name: string;

  @Column({
    enum: MeetingCategoryEnum,
    nullable: false,
  })
  category: MeetingCategoryEnumType;

  @Column({
    nullable: true,
  })
  explanation: string;

  @Column({
    type: 'integer',
    default: 10,
  })
  limit: number;

  @Column()
  thumbnail: string;

  @Column()
  canJoin: boolean;

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

  static create({ name, explanation, limit, thumbnail, canJoin }: CreateMeetingDto): Meeting {
    const meeting = new Meeting();

    meeting.name = name;
    meeting.explanation = explanation;
    meeting.limit = limit;
    meeting.thumbnail = thumbnail;
    meeting.canJoin = canJoin;

    return meeting;
  }

  // only use for test
  static createForTest({ meeting_id, ...props }: CreateMeetingDto & { meeting_id: number }) {
    const meeting = Meeting.create(props);
    meeting.meeting_id = meeting_id;

    return meeting;
  }

  updateBasicInfo({
    name,
    explanation,
    limit,
    canJoin,
  }: {
    name: string;
    explanation: string;
    limit: number;
    canJoin: boolean;
  }) {
    this.name = name;
    this.explanation = explanation;
    this.limit = limit;
    this.canJoin = canJoin;
  }
}
