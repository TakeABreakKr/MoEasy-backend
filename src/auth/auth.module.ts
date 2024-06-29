import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DiscordStrategy } from './discord.strategy'

@Module({
  imports: [PassportModule],
  providers: [AuthService, DiscordStrategy],
  controllers: [AuthController]
})

export class AuthModule { }
