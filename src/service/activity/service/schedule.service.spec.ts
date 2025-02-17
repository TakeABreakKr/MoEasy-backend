import { Test, TestingModule } from '@nestjs/testing';
import { NotificationComponentImpl } from '@domain/notification/component/notification.component';
import { ScheduleService } from '../service/schedule.service.interface';
import { ScheduleServiceImpl } from '../service/schedule.service';
import { ScheduleComponentImpl } from '@domain/schedule/component/schedule.component';
import { MemberComponentImpl } from '@domain/member/component/member.component';
import { MeetingComponentImpl } from '@domain/meeting/component/meeting.component';
import { ParticipantComponentImpl } from '@domain/schedule/component/participant.component';
import { AuthorityComponentImpl } from '@domain/member/component/authority.component';

describe('ScheduleServiceTest', async () => {
  let scheduleService: ScheduleService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ScheduleService', useClass: ScheduleServiceImpl },
        { provide: 'ScheduleComponent', useClass: ScheduleComponentImpl },
        { provide: 'MemberComponent', useClass: MemberComponentImpl },
        { provide: 'MeetingComponent', useClass: MeetingComponentImpl },
        { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
        { provide: 'NotificationComponent', useClass: NotificationComponentImpl },
        { provide: 'AuthorityComponent', useClass: AuthorityComponentImpl },
      ],
    }).compile();
    scheduleService = module.get<ScheduleService>('ScheduleService');
  });

  it('createScheduleTest', () => {});
  it('updateScheduleTest', () => {});
  it('getScheduleTest', () => {});
  it('getScheduleListTest', () => {});
  it('withdrawTest', () => {});
  it('deleteTest', () => {});
});
