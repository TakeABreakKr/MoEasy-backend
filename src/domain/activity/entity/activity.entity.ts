import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Participant } from '@domain/activity/entity/participant.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { Address } from '@domain/activity/entity/address.embedded';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { ActivityUpdateVO } from '@domain/activity/vo/activity.update.vo';
import { ActivityUtils } from '@utils/activity.utils';
import { MeetingUtils } from '@utils/meeting.utils';
import { Attachment } from '@file/entity/attachment.entity';
import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';

@Entity()
export class Activity extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'activity_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  thumbnailId: number;

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

  @Column({
    nullable: true,
    length: 1000,
  })
  notice: string;

  @Column({
    type: 'tinyint',
    nullable: false,
  })
  onlineYn: boolean;

  @Column()
  onlineLink: string;

  @Column(() => Address)
  address: Address;

  @Column()
  detailAddress: string;

  @Column()
  participantLimit: number;

  @Column({
    name: 'meeting_id',
    nullable: false,
  })
  meetingId: number;

  @ManyToOne(() => Meeting, (meeting) => meeting.activities, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @OneToMany(() => Participant, (participant) => participant.activity)
  participants: Promise<Participant[]>;

  @OneToOne(() => Attachment)
  @JoinColumn({ name: 'thumbnail_id' })
  thumbnail: Promise<Attachment>;

  @OneToMany(() => ActivityNoticeImage, (activityNoticeImage) => activityNoticeImage.activity)
  noticeImages: ActivityNoticeImage[];

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  public getOnlineLink(): string | null {
    return this.onlineYn ? this.onlineLink : null;
  }

  public static create(activityCreateVO: ActivityCreateVO): Activity {
    const activity = new Activity();
    activity.name = activityCreateVO.name;
    activity.startDate = activityCreateVO.startDate;
    activity.endDate = activityCreateVO.endDate;
    activity.reminder = ActivityUtils.reminderListToMask(activityCreateVO.reminder);
    activity.notice = activityCreateVO.notice;
    activity.onlineYn = activityCreateVO.onlineYn;
    activity.address = activityCreateVO.address;
    activity.detailAddress = activityCreateVO.detailAddress;
    activity.participantLimit = activityCreateVO.participantLimit;
    activity.meetingId = MeetingUtils.transformMeetingIdToInteger(activityCreateVO.meetingId);
    activity.onlineLink = activityCreateVO.onlineLink;
    activity.thumbnailId = activityCreateVO.thumbnailId;
    return activity;
  }

  update(activityUpdateVO: ActivityUpdateVO) {
    this.name = activityUpdateVO.name;
    this.startDate = activityUpdateVO.startDate;
    this.endDate = activityUpdateVO.endDate;
    this.reminder = ActivityUtils.reminderListToMask(activityUpdateVO.reminder);
    this.notice = activityUpdateVO.notice;
    this.onlineYn = activityUpdateVO.onlineYn;
    this.address = activityUpdateVO.address;
    this.detailAddress = activityUpdateVO.detailAddress;
    this.participantLimit = activityUpdateVO.participantLimit;
    this.onlineLink = activityUpdateVO.onlineLink;
    this.thumbnailId = activityUpdateVO.thumbnailId;
  }

  //only for test
  public static createForTest(activityId: number, activityVO: ActivityCreateVO): Activity {
    const activity = Activity.create(activityVO);
    activity.id = activityId;
    activity.createdAt = new Date();
    activity.updatedAt = new Date();
    return activity;
  }
}
