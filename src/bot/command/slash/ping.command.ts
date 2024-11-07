import { Injectable } from '@nestjs/common';
import { Context, SlashCommandContext, TextCommand } from 'necord';

@Injectable()
export class PingCommand {
  @TextCommand({
    name: 'ping',
    description: 'ping check',
  })
  public onPing(@Context() [interaction]: SlashCommandContext) {
    return interaction.reply({ content: 'pong' });
  }
}
