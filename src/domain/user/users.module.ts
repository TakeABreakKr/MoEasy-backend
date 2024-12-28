import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { UsersDaoImpl } from './dao/users.dao';
import { UsersComponentImpl } from '@domain/user/component/users.component';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [
    { provide: 'UsersDao', useClass: UsersDaoImpl },
    { provide: 'UsersComponent', useClass: UsersComponentImpl },
  ],
  exports: ['UsersComponent'],
})
export class UsersModule {}
