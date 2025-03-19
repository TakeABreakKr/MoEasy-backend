import { Module } from '@nestjs/common';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { ActivityModule } from '@domain/activity/activity.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { ActivityController } from '@service/activity/controller/activity.controller';
import { ActivityServiceImpl } from '@service/activity/service/activity.service';
import { UsersModule } from '@root/domain/user/users.module';

@Module({
  imports: [MemberModule, MeetingModule, ActivityModule, NotificationModule, UsersModule],
  providers: [{ provide: 'ActivityService', useClass: ActivityServiceImpl }],
  controllers: [ActivityController],
})
export class ActivityServiceModule {}
