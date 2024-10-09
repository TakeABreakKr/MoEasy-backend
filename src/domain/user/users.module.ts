import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersDao } from './dao/users.dao';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { DiscordComponent } from './component/discord.component';
import { AuthorityComponent } from '@domain/user/component/authority.component';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), HttpModule],
  controllers: [AuthController],
  providers: [UsersDao, DiscordComponent, AuthService, AuthorityComponent],
  exports: [UsersDao],
})
export class UsersModule {}
