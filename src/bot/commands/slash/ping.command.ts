import { Command, Handler } from '@discord-nestjs/core';
import { ChatInputCommandInteraction } from 'discord.js';

@Command({
  name: 'ping',
  description: 'ping check',
})
export class PingCommand {
  @Handler()
  onPing(interaction: ChatInputCommandInteraction): string {
    return 'pong';
  }
}