import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BotGateway } from './gateway/bot.gateway';
import { CommandModule } from '@domain/discord/command/command.module';
import { MessageComponentImpl } from '@domain/discord/component/message.component';
import { DiscordComponentImpl } from '@domain/discord/component/discord.component';

@Module({
  imports: [CommandModule, HttpModule],
  providers: [
    BotGateway,
    { provide: 'DiscordComponent', useClass: DiscordComponentImpl },
    { provide: 'MessageComponent', useClass: MessageComponentImpl },
  ],
  exports: ['DiscordComponent', 'MessageComponent'],
})
export class DiscordModule {}
