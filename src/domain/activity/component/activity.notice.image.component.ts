import { Inject, Injectable } from '@nestjs/common';
import { ActivityNoticeImageDao } from '@domain/activity/dao/activity.notice.image.dao.interface';
import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';
import { ActivityNoticeImageComponent } from '@domain/activity/component/activity.notice.image.component.interface';

@Injectable()
export class ActivityNoticeImageComponentImpl implements ActivityNoticeImageComponent {
  constructor(
    @Inject('ActivityNoticeImageDao')
    private activityNoticeImageDao: ActivityNoticeImageDao,
  ) {}

  async create(activityId: number, attachmentId: number, attachmentPath: string): Promise<ActivityNoticeImage> {
    return this.activityNoticeImageDao.create(activityId, attachmentId, attachmentPath);
  }

  async findByActivityId(activityId: number): Promise<ActivityNoticeImage[]> {
    return this.activityNoticeImageDao.findByActivityId(activityId);
  }
}
