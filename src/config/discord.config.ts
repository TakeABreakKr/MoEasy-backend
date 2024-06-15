import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiscordModuleOption, DiscordOptionsFactory } from '@discord-nestjs/core';
import { GatewayIntentBits } from 'discord.js';

@Injectable()
export class DiscordConfig implements DiscordOptionsFactory {
  constructor(private configService: ConfigService) {}

  createDiscordOptions(): DiscordModuleOption {
    return {
      token: this.configService.get('discord.token'),
      discordClientOptions: {
        intents: [GatewayIntentBits.Guilds],
      },
    };
  }
}
