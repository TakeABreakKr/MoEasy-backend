import { Module } from '@nestjs/common';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { ScheduleModule } from '@domain/schedule/schedule.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { ScheduleController } from '@service/schedule/controller/schedule.controller';
import { ScheduleServiceImpl } from '@service/schedule/service/schedule.service';

@Module({
  imports: [MemberModule, MeetingModule, ScheduleModule, NotificationModule],
  providers: [{ provide: 'ScheduleService', useClass: ScheduleServiceImpl }],
  controllers: [ScheduleController],
})
export class ScheduleServiceModule {}
