import { Injectable, Logger } from '@nestjs/common';
import { Context, ContextOf, Once } from 'necord';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  @Once('ready')
  onReady(@Context() [client]: ContextOf<'ready'>) {
    this.logger.log(`Bot ${client.user.tag} was started`);
  }
}
