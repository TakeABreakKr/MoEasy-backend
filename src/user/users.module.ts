import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersDao } from './users.dao';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersDao],
})
export class UsersModule {
}
