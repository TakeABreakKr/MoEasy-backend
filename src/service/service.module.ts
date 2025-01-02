import { Module } from '@nestjs/common';
import { DomainModule } from '@domain/domain.module';
import { AuthServiceModule } from '@service/auth/auth.service.module';
import { MeetingServiceModule } from '@service/meeting/meeting.service.module';
import { ScheduleServiceModule } from '@service/schedule/schedule.service.module';
import { NotificationServiceModule } from '@service/notification/notification.service.module';
import { HomeServiceModule } from '@service/home/home.service.module';

@Module({
  imports: [
    DomainModule,
    AuthServiceModule,
    MeetingServiceModule,
    ScheduleServiceModule,
    NotificationServiceModule,
    HomeServiceModule,
  ],
})
export class ServiceModule {}
