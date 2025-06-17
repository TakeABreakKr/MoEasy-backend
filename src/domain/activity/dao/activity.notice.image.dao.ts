import { Injectable } from '@nestjs/common';
import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityNoticeImageDao } from '@domain/activity/dao/activity.notice.image.dao.interface';

@Injectable()
export class ActivityNoticeImageDaoImpl implements ActivityNoticeImageDao {
  constructor(
    @InjectRepository(ActivityNoticeImage)
    private activityImageRepository: Repository<ActivityNoticeImage>,
  ) {}

  async create(activityId: number, attachmentId: number): Promise<ActivityNoticeImage> {
    const activityNoticeImage = ActivityNoticeImage.create(activityId, attachmentId);
    await this.activityImageRepository.save(activityNoticeImage);
    return activityNoticeImage;
  }

  async findByActivityId(activityId: number): Promise<ActivityNoticeImage[]> {
    return this.activityImageRepository.findBy({ activityId });
  }
}
