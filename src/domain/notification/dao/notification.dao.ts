import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';

@Injectable()
export class NotificationDao {
  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}

  async getListByUserId(userId: number): Promise<Notification[]> {
    const notificationList = await this.notificationRepository.findBy({ users_id: userId });

    return notificationList || [];
  }

  async save(notification: Notification) {
    await this.notificationRepository.save(notification);
  }

  async saveAll(notificationList: Notification[]) {
    await this.notificationRepository.save(notificationList);
  }

  async getByIdList(notificationIdList: number[]) {
    return this.notificationRepository.findByIds(notificationIdList);
  }
}
