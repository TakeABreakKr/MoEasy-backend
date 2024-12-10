import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { Member } from './entity/member.entity';
import { MeetingController } from './controller/meeting.controller';
import { MeetingDaoImpl } from './dao/meeting.dao';
import { MemberDaoImpl } from './dao/member.dao';
import { MeetingServiceImpl } from './service/meeting.service';
import { KeywordDaoImpl } from './dao/keyword.dao';
import { Keyword } from './entity/keyword.entity';
import { MemberController } from './controller/member.controller';
import { MemberServiceImpl } from './service/member.service';
import { UsersModule } from '@domain/user/users.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { AuthorityComponentImpl } from '@domain/meeting/component/authority.component';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Member, Keyword]), UsersModule, NotificationModule],
  providers: [
    { provide: 'MeetingDao', useClass: MeetingDaoImpl },
    { provide: 'MemberDao', useClass: MemberDaoImpl },
    { provide: 'KeywordDao', useClass: KeywordDaoImpl },
    { provide: 'MeetingService', useClass: MeetingServiceImpl },
    { provide: 'MemberService', useClass: MemberServiceImpl },
    { provide: 'AuthorityComponent', useClass: AuthorityComponentImpl},
  ],
  controllers: [MeetingController, MemberController],
  exports: [MemberDaoImpl],
})
export class MeetingModule {}
