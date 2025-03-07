import { Module } from '@nestjs/common';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { UsersModule } from '@domain/user/users.module';
import { ActivityModule } from '@domain/activity/activity.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { DiscordModule } from '@domain/discord/discord.module';

@Module({
  imports: [UsersModule, MeetingModule, ActivityModule, NotificationModule, DiscordModule],
})
export class DomainModule {}
