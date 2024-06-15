import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingDao } from './dao/meeting.dao';
import { MemberDao } from './dao/member.dao';
import { Meeting } from './entity/meeting.entity';
import { Member } from './entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Member])],
  providers: [MeetingDao, MemberDao],
})
export class MeetingModule {}
