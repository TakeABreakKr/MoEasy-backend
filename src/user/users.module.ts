import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersDao } from './dao/users.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [UsersDao],
})
export class UsersModule {}
