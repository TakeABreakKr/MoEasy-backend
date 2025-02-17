import { Module } from '@nestjs/common';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { MemberModule } from '@domain/member/member.module';
import { UsersModule } from '@domain/user/users.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { MemberController } from '@service/member/controller/member.controller';
import { MemberServiceImpl } from '@service/member/service/member.service';

@Module({
  imports: [MeetingModule, MemberModule, UsersModule, NotificationModule],
  providers: [{ provide: 'MemberService', useClass: MemberServiceImpl }],
  controllers: [MemberController],
})
export class MemberServiceModule {}
