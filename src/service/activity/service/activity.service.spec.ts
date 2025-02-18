import { Test, TestingModule } from '@nestjs/testing';
import { NotificationComponentImpl } from '@domain/notification/component/notification.component';
import { MemberComponentImpl } from '@domain/member/component/member.component';
import { MeetingComponentImpl } from '@domain/meeting/component/meeting.component';
import { AuthorityComponentImpl } from '@domain/member/component/authority.component';
import { ActivityService } from '@service/activity/service//activity.service.interface';
import { ParticipantComponentImpl } from '@root/domain/activity/component/participant.component';
import { ActivityComponentImpl } from '@root/domain/activity/component/activity.component';
import { ActivityServiceImpl } from '@service/activity/service/activity.service';

describe('ScheduleServiceTest', async () => {
  let activityService: ActivityService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'ScheduleService', useClass: ActivityServiceImpl },
        { provide: 'ScheduleComponent', useClass: ActivityComponentImpl },
        { provide: 'MemberComponent', useClass: MemberComponentImpl },
        { provide: 'MeetingComponent', useClass: MeetingComponentImpl },
        { provide: 'ParticipantComponent', useClass: ParticipantComponentImpl },
        { provide: 'NotificationComponent', useClass: NotificationComponentImpl },
        { provide: 'AuthorityComponent', useClass: AuthorityComponentImpl },
      ],
    }).compile();
    activityService = module.get<ActivityService>('ActivityService');
  });

  it('createActivityTest', () => {});
  it('updateActivityTest', () => {});
  it('getActivityTest', () => {});
  it('getActivityListTest', () => {});
  it('withdrawTest', () => {});
  it('deleteTest', () => {});
});
