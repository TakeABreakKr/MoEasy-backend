import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiscordComponent } from '@domain/auth/component/discord.component';

@Module({
  imports: [HttpModule],
  providers: [DiscordComponent],
  exports: [DiscordComponent],
})
export class AuthModule {}
