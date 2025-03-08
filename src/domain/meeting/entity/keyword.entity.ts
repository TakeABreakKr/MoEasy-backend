import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Keyword extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'keyword_id',
  })
  id: number;

  @Column({
    name: 'meeting_id',
  })
  meetingId: number;

  @Column({
    length: 10,
  })
  keyword: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.keywords)
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public static create(keyword: string, meetingId: number): Keyword {
    const keywordEntity = new Keyword();
    keywordEntity.meetingId = meetingId;
    keywordEntity.keyword = keyword;
    return keywordEntity;
  }
}
