import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityDaoImpl } from '@domain/activity/dao/activity.dao';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDaoImpl } from '@domain/activity/dao/participant.dao';
import { ActivityComponentImpl } from '@domain/activity/component/activity.component';
import { ParticipantComponentImpl } from '@domain/activity/component/participant.component';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Participant])],
  providers: [
    { provide: 'ActivityDao', useClass: ActivityDaoImpl },
    { provide: 'ParticipantDao', useClass: ParticipantDaoImpl },
    { provide: 'ActivityComponent', useClass: ActivityComponentImpl },
    { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
  ],
  exports: ['ActivityComponent', 'ParticipantComponent'],
})
export class ActivityModule {}
