import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscordModule } from '@discord-nestjs/core';

import configuration from './config/configuration';
import { DiscordConfig } from './config/discord.config';
import { DBConfig } from './config/db.config';

import { BotModule } from './bot/bot.module';
import { UsersModule } from './user/users.module';
import { MeetingModule } from './meeting/meeting.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: DBConfig,
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DiscordConfig,
    }),
    BotModule,
    UsersModule,
    MeetingModule,
    ScheduleModule,
  ],
})
export class AppModule {}
