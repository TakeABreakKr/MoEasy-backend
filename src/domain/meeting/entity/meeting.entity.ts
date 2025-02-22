import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { Member } from '@domain/member/entity/member.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { Keyword } from './keyword.entity';
import { CreateMeetingDto } from '../dto/create.meeting.dto';
import * as MeetingCategoryEnum from '@enums/meeting.category.enum';

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
    type: 'enum',
    enum: Object.keys(MeetingCategoryEnum.MeetingCategoryEnum),
    nullable: false,
  })
  category: keyof typeof MeetingCategoryEnum.MeetingCategoryEnum;

  @Column({
    type: 'longtext',
    nullable: true,
  })
  explanation: string;

  @Column({
    type: 'integer',
    default: 10,
  })
  limit: number;

  @Column({
    type: 'tinyint',
  })
  publicYn: boolean;

  @Column()
  thumbnail: string;

  @Column()
  canJoin: boolean;

  @OneToMany(() => Keyword, (keyword) => keyword.meeting)
  keywords: Promise<Keyword[]>;

  @OneToMany(() => Activity, (activity) => activity.meeting)
  activities: Promise<Activity[]>;

  @OneToMany(() => Member, (member) => member.meeting)
  members: Promise<Member[]>;

  getCategory(): MeetingCategoryEnum.MeetingCategoryEnumType {
    return MeetingCategoryEnum.MeetingCategoryEnum[this.category];
  }

  async getKeywords(): Promise<Keyword[]> {
    return this.keywords;
  }

  async getActivities(): Promise<Activity[]> {
    return this.activities;
  }

  async getMembers(): Promise<Member[]> {
    return this.members;
  }

  static create({ name, category, explanation, limit, publicYn, thumbnail, canJoin }: CreateMeetingDto): Meeting {
    const meeting = new Meeting();

    meeting.name = name;
    meeting.category = MeetingCategoryEnum.findEnumKeyFromValue(category);
    meeting.explanation = explanation;
    meeting.limit = limit;
    meeting.publicYn = publicYn;
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
    publicYn,
    canJoin,
  }: {
    name: string;
    explanation: string;
    limit: number;
    publicYn: boolean;
    canJoin: boolean;
  }) {
    this.name = name;
    this.explanation = explanation;
    this.limit = limit;
    this.publicYn = publicYn;
    this.canJoin = canJoin;
  }
}
