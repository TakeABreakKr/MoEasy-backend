import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entity/activity.entity';
import { ActivityDao } from './dao/activity.dao';
import { Participant } from './entity/participant.entity';
import { ParticipantDao } from './dao/participant.dao';
import { ActivityComponentImpl } from '@domain/activity/component/activity.component';
import { ParticipantComponentImpl } from '@domain/activity/component/participant.component';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Participant])],
  providers: [
    ActivityDao,
    ParticipantDao,
    { provide: 'ActivityComponent', useClass: ActivityComponentImpl },
    { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
  ],
  exports: ['ActivityComponent', 'ParticipantComponent'],
})
export class ActivityModule {}
