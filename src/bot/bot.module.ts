import { Module } from '@nestjs/common';
import { DiscordModule } from '@discord-nestjs/core';
import { BotGateway } from './bot.gateway';
import { SlashCommandModule } from './commands/slash/slash.command.module';

@Module({
  imports: [DiscordModule.forFeature(), SlashCommandModule],
  providers: [BotGateway],
})
export class BotModule { }
