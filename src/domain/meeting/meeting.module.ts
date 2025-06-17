import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { MeetingDaoImpl } from './dao/meeting.dao';
import { KeywordDaoImpl } from '@domain/meeting/dao/keyword.dao';
import { Keyword } from '@domain/meeting/entity/keyword.entity';
import { MeetingComponentImpl } from '@domain/meeting/component/meeting.component';
import { KeywordComponentImpl } from '@domain/meeting/component/keyword.component';
import { MeetingLikeComponentImpl } from '@domain/meeting/component/meeting.like.component';
import { MeetingLikeDaoImpl } from '@domain/meeting/dao/meeting.like.dao';
import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Meeting, Keyword, MeetingLike])],
  providers: [
    { provide: 'MeetingDao', useClass: MeetingDaoImpl },
    { provide: 'KeywordDao', useClass: KeywordDaoImpl },
    { provide: 'MeetingLikeDao', useClass: MeetingLikeDaoImpl },
    { provide: 'MeetingComponent', useClass: MeetingComponentImpl },
    { provide: 'KeywordComponent', useClass: KeywordComponentImpl },
    { provide: 'MeetingLikeComponent', useClass: MeetingLikeComponentImpl },
  ],
  exports: ['MeetingComponent', 'KeywordComponent', 'MeetingLikeComponent'],
})
export class MeetingModule {}
