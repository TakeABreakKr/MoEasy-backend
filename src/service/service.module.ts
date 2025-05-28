import { Module } from '@nestjs/common';
import { AuthServiceModule } from '@service/auth/auth.service.module';
import { MeetingServiceModule } from '@root/service/notification/meeting.service.module';
import { ActivityServiceModule } from '@service/activity/activity.service.module';
import { NotificationServiceModule } from '@service/notification/notification.service.module';
import { HomeServiceModule } from '@service/home/home.service.module';
import { MemberServiceModule } from '@service/member/member.service.module';

@Module({
  imports: [
    AuthServiceModule,
    MeetingServiceModule,
    MemberServiceModule,
    ActivityServiceModule,
    NotificationServiceModule,
    HomeServiceModule,
  ],
})
export class ServiceModule {}
