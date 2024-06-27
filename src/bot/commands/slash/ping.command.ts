import { Command, Handler } from '@discord-nestjs/core';

@Command({
  name: 'ping',
  description: 'ping check',
})
export class PingCommand {
  @Handler()
  onPing(): string {
    return 'pong';
  }
}
