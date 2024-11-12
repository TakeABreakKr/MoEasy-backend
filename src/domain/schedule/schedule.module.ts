import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entity/schedule.entity';
import { ScheduleDao } from './dao/schedule.dao';
import { Participant } from './entity/participant.entity';
import { ParticipantDao } from './dao/participant.dao';
import { ScheduleController } from '@domain/schedule/controller/schedule.controller';
import { ScheduleServiceImpl } from '@domain/schedule/service/schedule.service';
import { MeetingModule } from '@domain/meeting/meeting.module';
import { NotificationModule } from '@domain/notification/notification.module';
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { MeetingDao } from '@domain/meeting/dao/meeting.dao';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Participant, Meeting]), MeetingModule, NotificationModule],
  controllers: [ScheduleController],
  providers: [
    ScheduleDao,
    ParticipantDao,
    MeetingDao,
    NotificationModule,
    { provide: 'ScheduleService', useClass: ScheduleServiceImpl },
    AuthorityComponent,
  ],
})
export class ScheduleModule {}
