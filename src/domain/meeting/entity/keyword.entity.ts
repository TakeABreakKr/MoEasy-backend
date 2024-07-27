import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

@Entity()
export class Keyword {
  @PrimaryGeneratedColumn('increment')
  keyword_id: number;

  @Column()
  meeting_id: number;

  @Column()
  keyword: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.keywords)
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public static create(keyword: string, meeting_id: number): Keyword {
    const keywordEntity = new Keyword();
    keywordEntity.meeting_id = meeting_id;
    keywordEntity.keyword = keyword;
    return keywordEntity;
  }
}
