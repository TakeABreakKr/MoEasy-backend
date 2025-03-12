import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { UsersDaoImpl } from './dao/users.dao';
import { DiscordModule } from '@domain/discord/discord.module';
import { UsersComponentImpl } from '@domain/user/component/users.component';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), DiscordModule],
  providers: [
    { provide: 'UsersDao', useClass: UsersDaoImpl },
    { provide: 'UsersComponent', useClass: UsersComponentImpl },
  ],
  exports: ['UsersComponent'],
})
export class UsersModule {}
