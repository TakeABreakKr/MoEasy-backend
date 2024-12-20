import { Test, TestingModule } from '@nestjs/testing';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao';
import { MeetingDao } from '@domain/meeting/dao/meeting.dao';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { ScheduleDao } from '@domain/schedule/dao/schedule.dao';
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { NotificationComponent } from '@domain/notification/component/notification.component';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { ScheduleServiceImpl } from '@domain/schedule/service/schedule.service';

describe('ScheduleServiceTest', async () => {
  let scheduleService: ScheduleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ScheduleService', useClass: ScheduleServiceImpl },
        { provide: 'ScheduleDao', useClass: ScheduleDao },
        { provide: 'MemberDao', useClass: MemberDao },
        { provide: 'MeetingDao', useClass: MeetingDao },
        { provide: 'ParticipantDao', useClass: ParticipantDao },
        AuthorityComponent,
        NotificationComponent,
      ],
    }).compile();
    scheduleService = module.get<ScheduleService>('ScheduleService');
  });
});
