import { Module } from '@nestjs/common';
import { MeetingModule } from './meeting/meeting.module';
import { UsersModule } from './user/users.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [UsersModule, MeetingModule, ScheduleModule],
})
export class DomainModule {}
