import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { DiscordComponent } from './component/discord.component';
import { UsersDaoImpl } from './dao/users.dao';
@Module({
  imports: [TypeOrmModule.forFeature([Users]), HttpModule],
  controllers: [AuthController],
  providers: [{ provide: 'UsersDao', useClass: UsersDaoImpl }, DiscordComponent, AuthService],
  exports: ['UsersDao'],
})
export class UsersModule {}
