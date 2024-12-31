import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Participant } from './participant.entity';
import { BaseEntity } from '../../common/base.entity';
import { Address } from '@domain/schedule/entity/address.embedded';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';
import { ScheduleUpdateVO } from '@domain/schedule/vo/schedule.update.vo';
import { ScheduleUtils } from '@utils/schedule.utils';
import { MeetingUtils } from '@utils/meeting.utils';

@Entity()
export class Schedule extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  schedule_id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column()
  explanation: string;

  @Column({
    type: 'datetime',
    nullable: false,
  })
  startDate: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  endDate: Date;

  @Column({
    nullable: false,
  })
  reminder: number;

  @Column()
  announcement: string;

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

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public static create(scheduleVO: ScheduleCreateVO): Schedule {
    const schedule = new Schedule();
    schedule.name = scheduleVO.name;
    schedule.explanation = scheduleVO.explanation;
    schedule.startDate = scheduleVO.startDate;
    schedule.endDate = scheduleVO.endDate;
    schedule.reminder = ScheduleUtils.reminderListToMask(scheduleVO.reminder);
    schedule.announcement = scheduleVO.announcement;
    schedule.onlineYn = scheduleVO.onlineYn;
    schedule.address = scheduleVO.address.toAddress();
    schedule.detailAddress = scheduleVO.detailAddress;
    schedule.meeting_id = MeetingUtils.transformMeetingIdToInteger(scheduleVO.meetingId);

    return schedule;
  }

  //only for test
  public static createForTest(schedule_id: number, scheduleVO: ScheduleCreateVO): Schedule {
    const schedule = new Schedule();
    schedule.schedule_id = schedule_id;
    schedule.name = scheduleVO.name;
    schedule.explanation = scheduleVO.explanation;
    schedule.startDate = scheduleVO.startDate;
    schedule.endDate = scheduleVO.endDate;
    schedule.reminder = ScheduleUtils.reminderListToMask(scheduleVO.reminder);
    schedule.announcement = scheduleVO.announcement;
    schedule.onlineYn = scheduleVO.onlineYn;
    schedule.meeting_id = MeetingUtils.transformMeetingIdToInteger(scheduleVO.meetingId);
    return schedule;
  }

  update(scheduleUpdateVO: ScheduleUpdateVO) {
    this.name = scheduleUpdateVO.name;
    this.explanation = scheduleUpdateVO.explanation;
    this.startDate = scheduleUpdateVO.startDate;
    this.endDate = scheduleUpdateVO.endDate;
    this.reminder = ScheduleUtils.reminderListToMask(scheduleUpdateVO.reminder);
    this.announcement = scheduleUpdateVO.announcement;
    this.onlineYn = scheduleUpdateVO.onlineYn;
    this.address = scheduleUpdateVO.address.toAddress();
    this.detailAddress = scheduleUpdateVO.detailAddress;
  }
}
