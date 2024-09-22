import { Module } from '@nestjs/common';
import { MeetingModule } from './meeting/meeting.module';
import { UsersModule } from './user/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { NotificationModule } from '@domain/notification/notification.module';

@Module({
  imports: [UsersModule, MeetingModule, ScheduleModule, NotificationModule],
})
export class DomainModule {}
