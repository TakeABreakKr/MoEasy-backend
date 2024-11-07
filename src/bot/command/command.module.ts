import { Module } from '@nestjs/common';
import { SlashCommandModule } from '@bot/command/slash/slash.command.module';

@Module({
  imports: [SlashCommandModule],
})
export class CommandModule {}
