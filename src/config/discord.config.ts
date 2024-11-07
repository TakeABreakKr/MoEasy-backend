import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GatewayIntentBits } from 'discord.js';
import { NecordModuleOptions } from 'necord';

@Injectable()
export class DiscordConfig {
  constructor(private configService: ConfigService) {}

  createNecordOptions(): NecordModuleOptions {
    return {
      token: this.configService.get('discord.token'),
      intents: [GatewayIntentBits.Guilds],
    };
  }
}
