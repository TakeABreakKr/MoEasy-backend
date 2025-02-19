import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Participant } from '@domain/activity/entity/participant.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { Address } from '@domain/activity/entity/address.embedded';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityUpdateVO } from '@domain/activity/vo/activity.update.vo';
import { ActivityUtils } from '@utils/activity.utils';
import { MeetingUtils } from '@utils/meeting.utils';

@Entity()
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  activity_id: number;

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

  @ManyToOne(() => Meeting, (meeting) => meeting.activities, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @OneToMany(() => Participant, (participant) => participant.activity)
  participants: Promise<Participant>;

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public static create(activityCreateVO: ActivityCreateVO): Activity {
    const activity = new Activity();
    activity.name = activityCreateVO.name;
    activity.explanation = activityCreateVO.explanation;
    activity.startDate = activityCreateVO.startDate;
    activity.endDate = activityCreateVO.endDate;
    activity.reminder = ActivityUtils.reminderListToMask(activityCreateVO.reminder);
    activity.announcement = activityCreateVO.announcement;
    activity.onlineYn = activityCreateVO.onlineYn;
    activity.address = activityCreateVO.address;
    activity.detailAddress = activityCreateVO.detailAddress;
    activity.meeting_id = MeetingUtils.transformMeetingIdToInteger(activityCreateVO.meetingId);

    return activity;
  }

  update(activityUpdateVO: ActivityUpdateVO) {
    this.name = activityUpdateVO.name;
    this.explanation = activityUpdateVO.explanation;
    this.startDate = activityUpdateVO.startDate;
    this.endDate = activityUpdateVO.endDate;
    this.reminder = ActivityUtils.reminderListToMask(activityUpdateVO.reminder);
    this.announcement = activityUpdateVO.announcement;
    this.onlineYn = activityUpdateVO.onlineYn;
    this.address = activityUpdateVO.address;
    this.detailAddress = activityUpdateVO.detailAddress;
  }

  //only for test
  public static createForTest(activity_id: number, activityVO: ActivityCreateVO): Activity {
    const activity = new Activity();
    activity.activity_id = activity_id;
    activity.name = activityVO.name;
    activity.explanation = activityVO.explanation;
    activity.startDate = activityVO.startDate;
    activity.endDate = activityVO.endDate;
    activity.reminder = ActivityUtils.reminderListToMask(activityVO.reminder);
    activity.announcement = activityVO.announcement;
    activity.onlineYn = activityVO.onlineYn;
    activity.address = activityVO.address;
    activity.detailAddress = activityVO.detailAddress;
    activity.meeting_id = MeetingUtils.transformMeetingIdToInteger(activityVO.meetingId);
    return activity;
  }
}
