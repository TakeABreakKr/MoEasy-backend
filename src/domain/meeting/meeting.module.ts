import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { Member } from './entity/member.entity';
import { MeetingController } from './controller/meeting.controller';
import { MeetingDao } from './dao/meeting.dao';
import { MemberDao } from './dao/member.dao';
import { MeetingServiceImpl } from './service/meeting.service';
import { KeywordDao } from './dao/keyword.dao';
import { Keyword } from './entity/keyword.entity';
import { MemberController } from './controller/member.controller';
import { MemberServiceImpl } from './service/member.service';
import { UsersModule } from '@domain/user/users.module';
import { NotificationModule } from '@domain/notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Member, Keyword]), UsersModule, NotificationModule],
  providers: [
    MeetingDao,
    MemberDao,
    KeywordDao,
    { provide: 'MeetingService', useClass: MeetingServiceImpl },
    { provide: 'MemberService', useClass: MemberServiceImpl },
  ],
  controllers: [MeetingController, MemberController],
  exports: [MemberDao],
})
export class MeetingModule {}
