import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordModule } from '@discord-nestjs/core';
import { DiscordConfig } from './config/discord.config';
import { BotModule } from './bot/bot.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DiscordModule.forRootAsync({
      imports: [ConfigModule],
      useClass: DiscordConfig,
    }),
    BotModule,
  ],
})
export class AppModule {
}
