import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { MemberDao } from '@domain/meeting/dao/member.dao';

@Injectable()
export class NotificationComponent {
  constructor(
    private notificationDao: NotificationDao,
    private memberDao: MemberDao,
  ) {}

  public async addNotification(content: string, userId: number) {
    const notification = Notification.create(content, userId);
    await this.notificationDao.save(notification);
  }

  public async addNotificationToMeetingMembers(content: string, meetingId: number) {
    const members = await this.memberDao.findByMeetingId(meetingId);
    const notifications = members.map((member) => {
      return Notification.create(content, member.users_id);
    });
    await this.notificationDao.saveAll(notifications);
  }
}
