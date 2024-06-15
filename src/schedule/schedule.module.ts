import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleDao } from './dao/schedule.dao';
import { Participant } from './entity/participant.entity';
import { ParticipantDao } from './dao/participant.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Participant])],
  providers: [ScheduleDao, ParticipantDao],
})
export class ScheduleModule {}
