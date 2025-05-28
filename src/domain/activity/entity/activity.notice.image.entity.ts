import { BaseEntity } from '@root/domain/common/base.entity';
import { Attachment } from '@root/file/entity/attachment.entity';
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
@Entity()
export class ActivityNoticeImage extends BaseEntity {
  @PrimaryColumn({
    name: 'activity_id',
  })
  activityId: number;

  @PrimaryColumn({
    name: 'attachment_id',
  })
  attachmentId: number;

  @ManyToOne(() => Activity, (activity) => activity.noticeImages)
  @JoinColumn({ name: 'activity_id' })
  activity: Activity;

  @OneToOne(() => Attachment)
  @JoinColumn({ name: 'attachment_id' })
  attachment: Attachment;

  public static create(activityId: number, attachmentId: number): ActivityNoticeImage {
    const activityNoticeImage = new ActivityNoticeImage();
    activityNoticeImage.activityId = activityId;
    activityNoticeImage.attachmentId = attachmentId;
    return activityNoticeImage;
  }
}
