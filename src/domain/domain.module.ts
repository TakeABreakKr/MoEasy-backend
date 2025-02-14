import { Module } from '@nestjs/common';
import { MeetingModule } from './meeting/meeting.module';
import { UsersModule } from './user/users.module';
import { ActivityModule } from '@domain/activity/activity.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { DiscordModule } from '@domain/discord/discord.module';

@Module({
  imports: [UsersModule, MeetingModule, ActivityModule, NotificationModule, DiscordModule],
})
export class DomainModule {}
