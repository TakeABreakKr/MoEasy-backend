import { Module } from '@nestjs/common';
import { UsersModule } from '@domain/user/users.module';
import { DiscordModule } from '@domain/discord/discord.module';
import { AuthController } from '@service/auth/controller/auth.controller';
import { AuthService } from '@service/auth/service/auth.service';

@Module({
  imports: [UsersModule, DiscordModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthServiceModule {}
