import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Participant } from './participant.entity';
import { BaseEntity } from '../../common/base.entity';

@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  schedule_id: number;

  @Column()
  name: string;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  startAt: Date;

  @Column({
    type: 'tinyint',
    default: false,
  })
  confirmYn: boolean;

  @Column({
    type: 'tinyint',
  })
  onlineYn: boolean;

  @ManyToOne(() => Meeting, (meeting) => meeting.schedules)
  meeting: Promise<Meeting>;

  @OneToMany(() => Participant, (participant) => participant.schedule)
  participants: Promise<Participant>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }
}
