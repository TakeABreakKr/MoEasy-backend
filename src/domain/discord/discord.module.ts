import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BotGateway } from './gateway/bot.gateway';
import { CommandModule } from '@domain/discord/command/command.module';
import { MessageComponent } from '@domain/discord/component/message.component';
import { DiscordComponent } from '@domain/discord/component/discord.component';

@Module({
  imports: [CommandModule, HttpModule],
  providers: [BotGateway, DiscordComponent, MessageComponent],
  exports: [DiscordComponent, MessageComponent],
})
export class DiscordModule {}
