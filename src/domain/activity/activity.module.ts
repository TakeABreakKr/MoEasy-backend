import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityDaoImpl } from '@domain/activity/dao/activity.dao';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDaoImpl } from '@domain/activity/dao/participant.dao';
import { ActivityComponentImpl } from '@domain/activity/component/activity.component';
import { ParticipantComponentImpl } from '@domain/activity/component/participant.component';
import { UsersComponentImpl } from '@domain/user/component/users.component';
import { UsersDaoImpl } from '@domain/user/dao/users.dao';
import { Users } from '@domain/user/entity/users.entity';
import { ActivityNoticeImageDaoImpl } from '@domain/activity/dao/activity.notice.image.dao';
import { ActivityNoticeImageComponentImpl } from '@domain/activity/component/activity.notice.image.component';
import { ActivityNoticeImage } from '@domain/activity/entity/activity.notice.image.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Participant, Users, ActivityNoticeImage])],
  providers: [
    { provide: 'ActivityDao', useClass: ActivityDaoImpl },
    { provide: 'ParticipantDao', useClass: ParticipantDaoImpl },
    { provide: 'ActivityComponent', useClass: ActivityComponentImpl },
    { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
    { provide: 'UsersComponent', useClass: UsersComponentImpl },
    { provide: 'UsersDao', useClass: UsersDaoImpl },
    { provide: 'ActivityNoticeImageDao', useClass: ActivityNoticeImageDaoImpl },
    { provide: 'ActivityNoticeImageComponent', useClass: ActivityNoticeImageComponentImpl },
  ],
  exports: ['ActivityComponent', 'ParticipantComponent', 'ActivityNoticeImageComponent'],
})
export class ActivityModule {}
