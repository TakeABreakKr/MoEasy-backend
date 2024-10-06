import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleDao } from './dao/schedule.dao';
import { Participant } from './entity/participant.entity';
import { ParticipantDao } from './dao/participant.dao';
import { ScheduleController } from '@domain/schedule/controller/schedule.controller';
import { ScheduleServiceImpl } from '@domain/schedule/service/schedule.service';
import { MeetingModule } from '@domain/meeting/meeting.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Participant]), MeetingModule],
  controllers: [ScheduleController],
  providers: [ScheduleDao, ParticipantDao, { provide: 'ScheduleService', useClass: ScheduleServiceImpl }],
})
export class ScheduleModule {}
