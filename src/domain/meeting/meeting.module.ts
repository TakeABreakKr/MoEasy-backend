import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { Member } from './entity/member.entity';
import { MeetingController } from './controller/meeting.controller';
import { MeetingDao } from './dao/meeting.dao';
import { MemberDao } from './dao/member.dao';
import { MeetingService } from './service/meeting.service';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Member])],
  providers: [MeetingDao, MemberDao, MeetingService],
  controllers: [MeetingController],
})
export class MeetingModule {}
