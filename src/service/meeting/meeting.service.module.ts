import { Module } from '@nestjs/common';
import { MeetingController } from '@service/meeting/controller/meeting.controller';
import { MeetingServiceImpl } from '@service/meeting/service/meeting.service';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { UsersModule } from '@domain/user/users.module';
import { NotificationModule } from '@domain/notification/notification.module';

@Module({
  imports: [MeetingModule, MemberModule, UsersModule, NotificationModule],
  providers: [{ provide: 'MeetingService', useClass: MeetingServiceImpl }],
  controllers: [MeetingController],
})
export class MeetingServiceModule {}
