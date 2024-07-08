import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { Member } from './entity/member.entity';
import { MeetingController } from './controller/meeting.controller';
import { MeetingDao } from './dao/meeting.dao';
import { MemberDao } from './dao/member.dao';
import { MeetingService } from './service/meeting.service';
import { KeywordDao } from './dao/keyword.dao';
import { Keyword } from './entity/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Member, Keyword])],
  providers: [MeetingDao, MemberDao, KeywordDao, MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
