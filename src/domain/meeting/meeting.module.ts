import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from './entity/meeting.entity';
import { MeetingDaoImpl } from './dao/meeting.dao';
import { KeywordDaoImpl } from './dao/keyword.dao';
import { Keyword } from './entity/keyword.entity';
import { MeetingComponentImpl } from '@domain/meeting/component/meeting.component';
import { KeywordComponentImpl } from '@domain/meeting/component/keyword.component';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Keyword])],
  providers: [
    { provide: 'MeetingDao', useClass: MeetingDaoImpl },
    { provide: 'KeywordDao', useClass: KeywordDaoImpl },
    { provide: 'MeetingComponent', useClass: MeetingComponentImpl },
    { provide: 'KeywordComponent', useClass: KeywordComponentImpl },
  ],
  exports: ['MeetingComponent', 'KeywordComponent'],
})
export class MeetingModule {}
