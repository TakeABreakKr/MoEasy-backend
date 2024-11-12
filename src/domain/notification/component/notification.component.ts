import { Injectable } from '@nestjs/common';
import { Notification } from '@domain/notification/entity/notification.entity';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao';

@Injectable()
export class NotificationComponent {
  constructor(
    private notificationDao: NotificationDao,
    private memberDao: MemberDao,
    private participantDao: ParticipantDao,
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

  public async addNotificationToParticipants(content: string, scheduleId: number) {
    const participants = await this.participantDao.findByScheduleId(scheduleId);
    const notifications = participants.map((participant) => {
      return Notification.create(content, participant.users_id);
    });
    await this.notificationDao.saveAll(notifications);
  }
}
