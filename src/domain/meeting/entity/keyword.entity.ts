import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from './meeting.entity';

export class Keyword {
  @PrimaryGeneratedColumn('increment')
  keyword_id: number;

  @Column()
  keyword: string;

  @ManyToOne(() => Meeting, (meeting) => meeting.keywords)
  meeting: Promise<Meeting>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }
}
