import { Module } from '@nestjs/common';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { UsersModule } from '@domain/user/users.module';
import { ActivityModule } from '@domain/activity/activity.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { DiscordModule } from '@domain/discord/discord.module';
import { CategoryModule } from '@domain/category/category.module';
import { RegionModule } from '@domain/region/region.module';

@Module({
  imports: [
    UsersModule,
    MeetingModule,
    ActivityModule,
    NotificationModule,
    DiscordModule,
    CategoryModule,
    RegionModule,
  ],
})
export class SeedModule {}
