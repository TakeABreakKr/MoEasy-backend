import type { Client } from 'discord.js';

import { Injectable, Logger } from '@nestjs/common';
import { InjectDiscordClient, Once } from '@discord-nestjs/core';

@Injectable()
export class BotGateway {
  private readonly logger = new Logger(BotGateway.name);

  constructor(
    @InjectDiscordClient() private readonly client: Client,
  ) {
  }

  @Once('ready')
  onReady() {
    this.logger.log(`Bot ${this.client.user.tag} was started`);
  }

}