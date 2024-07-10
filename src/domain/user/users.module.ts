import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersDao } from './dao/users.dao';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersDao, AuthService],
  controllers: [AuthController],
})
export class UsersModule {}
