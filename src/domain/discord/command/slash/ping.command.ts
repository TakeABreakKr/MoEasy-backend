import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';

@Injectable()
export class PingCommand {
  @SlashCommand({
    name: 'ping',
    description: 'ping check',
  })
  public onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'pong' });
  }
}
