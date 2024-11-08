import { Module } from '@nestjs/common';
import { SlashCommandModule } from '@domain/discord/command/slash/slash.command.module';

@Module({
  imports: [SlashCommandModule],
})
export class CommandModule {}
