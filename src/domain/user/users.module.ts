import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersDao } from './dao/users.dao';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { DiscordModule } from '@domain/discord/discord.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), DiscordModule],
  controllers: [AuthController],
  providers: [UsersDao, AuthService],
  exports: [UsersDao],
})
export class UsersModule {}
