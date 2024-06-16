import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '../../meeting/entity/meeting.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('increment')
  schedule_id: number;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  startAt: Date;

  @ManyToOne(() => Meeting, (meeting) => meeting.schedules)
  meeting: Promise<Meeting>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }
}
