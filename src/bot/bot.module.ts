import { Module } from '@nestjs/common';
import { BotGateway } from './bot.gateway';
import { CommandModule } from '@bot/command/command.module';

@Module({
  imports: [CommandModule],
  providers: [BotGateway],
})
export class BotModule {}
