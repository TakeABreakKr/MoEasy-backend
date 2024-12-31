import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleDaoImpl } from './dao/schedule.dao';
import { Participant } from './entity/participant.entity';
import { ParticipantDao } from './dao/participant.dao';
import { ScheduleComponentImpl } from '@domain/schedule/component/schedule.component';
import { ParticipantComponentImpl } from '@domain/schedule/component/participant.component';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Participant])],
  providers: [
    ScheduleDaoImpl,
    ParticipantDao,
    { provide: 'ScheduleComponent', useClass: ScheduleComponentImpl },
    { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
  ],
  exports: ['ScheduleComponent', 'ParticipantComponent'],
})
export class ScheduleModule {}
