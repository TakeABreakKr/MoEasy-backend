import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { BaseEntity } from '@domain/common/base.entity';

@Entity()
export class Keyword extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  keyword_id: number;

  @Column()
  meeting_id: number;

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

  public static create(keyword: string, meeting_id: number): Keyword {
    const keywordEntity = new Keyword();
    keywordEntity.meeting_id = meeting_id;
    keywordEntity.keyword = keyword;
    return keywordEntity;
  }
}
