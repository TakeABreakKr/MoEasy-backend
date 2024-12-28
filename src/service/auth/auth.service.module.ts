import { Module } from '@nestjs/common';
import { AuthController } from '@service/auth/controller/auth.controller';
import { AuthService } from '@service/auth/service/auth.service';
import { AuthModule } from '@domain/auth/auth.module';
import { UsersModule } from '@domain/user/users.module';

@Module({
  imports: [AuthModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthServiceModule {}
