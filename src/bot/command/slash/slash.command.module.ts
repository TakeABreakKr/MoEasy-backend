import { Module } from '@nestjs/common';
import { PingCommand } from './ping.command';
import { SigninCommand } from './signin.command';

@Module({
  providers: [PingCommand, SigninCommand],
})
export class SlashCommandModule {}
