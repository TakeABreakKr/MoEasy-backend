import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDao } from './notification.dao.interface';

@Injectable()
export class NotificationDaoImpl implements NotificationDao {
  constructor(@InjectRepository(Notification) private notificationRepository: Repository<Notification>) {}

  async getListByUserId(userId: number): Promise<Notification[]> {
    const notificationList = await this.notificationRepository.findBy({ userId });

    return notificationList || [];
  }

  async save(notification: Notification) {
    await this.notificationRepository.save(notification);
  }

  async saveAll(notificationList: Notification[]) {
    await this.notificationRepository.save(notificationList);
  }

  async getListByNotificationIds(notificationIdList: number[]) {
    return this.notificationRepository.findBy({ id: In(notificationIdList) });
  }
}
