import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Participant } from './participant.entity';
import { BaseEntity } from '../../common/base.entity';
import { Address } from '@domain/schedule/entity/address.embedded';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';
import { ScheduleUpdateVO } from '@domain/schedule/vo/schedule.update.vo';

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

  @Column(() => Address)
  address: Address;

  @Column()
  detailAddress: string;

  @Column()
  meeting_id: number;

  @ManyToOne(() => Meeting, (meeting) => meeting.schedules, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @OneToMany(() => Participant, (participant) => participant.schedule)
  participants: Promise<Participant>;

  @Column(() => Address)
  address: Address;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public static create(scheduleVO: ScheduleCreateVO): Schedule {
    const schedule = new Schedule();
    schedule.name = scheduleVO.name;
    //생략

    return schedule;
  }

  update(scheduleUpdateVO: ScheduleUpdateVO) {
    this.name = scheduleUpdateVO.name;
    //생략
  }
}
