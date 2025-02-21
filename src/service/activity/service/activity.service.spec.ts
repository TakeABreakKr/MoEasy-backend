import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '@service/activity/service//activity.service.interface';
import { ActivityServiceImpl } from '@service/activity/service/activity.service';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { Member } from '@root/domain/member/entity/member.entity';
import { CreateMemberDto } from '@root/domain/member/dto/create.member.dto';
import { MemberComponent } from '@root/domain/member/component/member.component.interface';
import { AuthorityComponent } from '@root/domain/member/component/authority.component.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { ActivityComponent } from '@root/domain/activity/component/activity.component.interface';
import { ParticipantComponent } from '@root/domain/activity/component/participant.component.interface';
import { Activity } from '@root/domain/activity/entity/activity.entity';
import { ActivityCreateVO } from '@root/domain/activity/vo/activity.create.vo';
import { Participant } from '@root/domain/activity/entity/participant.entity';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { ActivityStatusEnum } from '@root/enums/activityStatusEnum';
import { OrderingOptionEnum } from '@root/enums/ordering.option.enum';
import { Address } from '@root/domain/activity/entity/address.embedded';

const componentAccessLog: string[] = [];

class MockMeetingComponent implements MeetingComponent {
  public static findByMeetingIdLog = 'MeetingComponent.findByMeetingId called';
  public static createLog = 'MeetingComponent.create called';
  public static updateLog = 'MeetingComponent.update called';
  public static findAllLog = 'MeetingComponent.findAll called';
  public static deleteLog = 'MeetingComponent.delete called';
  public static findByMeetingIdsLog = 'MeetingComponent.findByMeetingIds called';

  private mockMeetings: Meeting[] = [
    Meeting.createForTest({
      meeting_id: 80,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 10,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: false,
    }),
    Meeting.createForTest({
      meeting_id: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 10,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdLog);

    const meeting = this.mockMeetings.find((meeting) => meeting.meeting_id === id);
    return meeting;
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdsLog);
    return this.mockMeetings.filter((meeting) => ids.includes(meeting.meeting_id));
  }

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    componentAccessLog.push(MockMeetingComponent.createLog);

    const meeting = Meeting.createForTest({ ...createMeetingDto, meeting_id: 3 });

    this.mockMeetings.push(meeting);
    return meeting;
  }

  async update(): Promise<void> {
    componentAccessLog.push(MockMeetingComponent.updateLog);
  }

  async findAll(): Promise<Meeting[]> {
    componentAccessLog.push(MockMeetingComponent.findAllLog);
    return this.mockMeetings;
  }

  async delete(id: number): Promise<void> {
    componentAccessLog.push(MockMeetingComponent.deleteLog);
    this.mockMeetings = this.mockMeetings.filter((meeting) => meeting.meeting_id !== id);
  }
}

class MockMemberComponent implements MemberComponent {
  public static findByUsersAndMeetingIdLog = 'MemberComponent.findByUsersAndMeetingId called';
  public static findByMeetingIdLog = 'MemberComponent.findByMeetingId called';
  public static saveAllLog = 'MemberComponent.saveAll called';
  public static findByUsersAndAuthoritiesLog = 'MemberComponent.findByUsersAndAuthorities called';
  public static createLog = 'MemberComponent.create called';
  public static updateAuthorityLog = 'MemberComponent.updateAuthority called';
  public static deleteByUsersAndMeetingIdLog = 'MemberComponent.deleteByUsersAndMeetingId called';
  public static findByUserIdLog = 'MemberComponent.findByUserId called';

  private mockMembers: Member[] = [
    Member.create({
      meetingId: 80,
      usersId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      usersId: 30,
      authority: AuthorityEnum.OWNER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      usersId: 20,
      authority: AuthorityEnum.OWNER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      usersId: 200,
      authority: AuthorityEnum.MEMBER,
    }),
  ];

  async findByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<Member | null> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndMeetingIdLog);

    const member = this.mockMembers.find((member) => member.users_id === users_id && member.meeting_id === meeting_id);
    return member || null;
  }

  async findByUsersAndAuthorities(users_id: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndAuthoritiesLog);

    return this.mockMembers.filter((member) => member.users_id === users_id && authorities.includes(member.authority));
  }

  async findByUserId(users_id: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByUserIdLog);

    return this.mockMembers.filter((member) => member.users_id === users_id);
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByMeetingIdLog);

    return this.mockMembers.filter((member) => member.meeting_id === meeting_id);
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    componentAccessLog.push(MockMemberComponent.createLog);

    const member = Member.create(createMemberDto);
    this.mockMembers.push(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    componentAccessLog.push(MockMemberComponent.updateAuthorityLog);

    member.authority = authority;
  }

  async deleteByUsersAndMeetingId(users_id: number, meeting_id: number): Promise<void> {
    componentAccessLog.push(MockMemberComponent.deleteByUsersAndMeetingIdLog);

    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.users_id === users_id && member.meeting_id === meeting_id),
    );
  }

  async saveAll(members: Member[]): Promise<void> {
    componentAccessLog.push(MockMemberComponent.saveAllLog);

    members.forEach((member) => {
      this.mockMembers.push(member);
    });
  }
}

class MockAuthorityComponent implements AuthorityComponent {
  public static validateAuthorityLog = 'AuthorityComponent.validateAuthority called';

  async validateAuthority() {
    componentAccessLog.push(MockAuthorityComponent.validateAuthorityLog);
  }
}

class MockNotificationComponent implements NotificationComponent {
  public static addNotificationsLog = 'NotificationComponent.addNotifications called';

  async addNotifications() {
    componentAccessLog.push(MockNotificationComponent.addNotificationsLog);
  }

  async addNotification() {}

  async getListByNotificationIds() {
    return [];
  }
  async getListByUserId() {
    return [];
  }
  async saveAll() {}
}

class MockActivityComponent implements ActivityComponent {
  public static createLog = 'ActivityComponent.create called';
  public static updateLog = 'ActivityComponent.update called';
  public static findByActivityIdLog = 'ActivityComponent.findByActivityId called';
  public static findByMeetingIdLog = 'ActivityComponent.findByMeetingId called';
  public static findAllByActivityIdsLog = 'ActivityComponent.findAllByActivityIds called';
  public static deleteLog = 'ActivityComponent.delete called';

  private mockActivitys: Activity[] = [
    Activity.createForTest(100, {
      meetingId: '64',
      name: 'moeasy1',
      explanation: '모임설명1',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항1',
      onlineYn: true,
      address: Address.createForTest(),
      detailAddress: '평택',
    }),
    Activity.createForTest(101, {
      meetingId: '64',
      name: 'moeasy4',
      explanation: '모임설명4',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항4',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '인천',
    }),
    Activity.createForTest(200, {
      meetingId: 'C8',
      name: 'moeasy2',
      explanation: '모임설명2',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항2',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '수원',
    }),
    Activity.createForTest(300, {
      meetingId: 'C8',
      name: 'moeasy3',
      explanation: '모임설명3',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항3',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '시흥',
    }),
  ];

  async create(activityCreateVO: ActivityCreateVO): Promise<Activity> {
    componentAccessLog.push(MockActivityComponent.createLog);

    const activity = Activity.createForTest(101, activityCreateVO);
    this.mockActivitys.push(activity);

    return activity;
  }

  async update(activity: Activity): Promise<void> {
    componentAccessLog.push(MockActivityComponent.updateLog);

    const index = this.mockActivitys.findIndex((activity) => activity.activity_id === activity.activity_id);
    this.mockActivitys[index] = activity;
  }

  async findByActivityId(activity_id: number): Promise<Activity | null> {
    componentAccessLog.push(MockActivityComponent.findByActivityIdLog);

    return this.mockActivitys.find((activity: Activity) => activity.activity_id === activity_id) || null;
  }

  async findByMeetingId(meeting_id: number): Promise<Activity[]> {
    componentAccessLog.push(MockActivityComponent.findByMeetingIdLog);

    return this.mockActivitys.filter((activity: Activity) => activity.meeting_id === meeting_id);
  }

  async findAllByActivityIds(activity_ids: number[]): Promise<Activity[]> {
    componentAccessLog.push(MockActivityComponent.findAllByActivityIdsLog);

    return this.mockActivitys.filter((activity: Activity) => activity_ids.includes(activity.activity_id));
  }

  async delete(activity_id: number): Promise<void> {
    componentAccessLog.push(MockActivityComponent.deleteLog);

    this.mockActivitys = this.mockActivitys.filter((activity: Activity) => activity.activity_id !== activity_id);
  }
}

class MockParticipantComponent implements ParticipantComponent {
  public static saveAllLog = 'ParticipantComponent.saveAll called';
  public static findByUserIdAndActivityIdLog = 'ParticipantComponent.findByUserIdAndActivityId called';
  public static findByActivityIdLog = 'ParticipantComponent.findByActivityId called';
  public static findAllByUserIdLog = 'ParticipantComponent.findAllByUserId called';
  public static deleteLog = 'ParticipantComponent.delete called';
  public static deleteAllLog = 'ParticipantComponent.deleteAll called';

  private mockParticipants: Participant[] = [
    Participant.create({ users_id: 200, activity_id: 100 }),
    Participant.create({ users_id: 30, activity_id: 100 }),
    Participant.create({ users_id: 200, activity_id: 200 }),
    Participant.create({ users_id: 30, activity_id: 200 }),
    Participant.create({ users_id: 20, activity_id: 300 }),
    Participant.create({ users_id: 70, activity_id: 300 }),
  ];

  async saveAll(participants: Participant[]): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.saveAllLog);

    this.mockParticipants.push(...participants);
  }

  async findByUserIdAndActivityId(user_id: number, activity_id: number): Promise<Participant | null> {
    componentAccessLog.push(MockParticipantComponent.findByUserIdAndActivityIdLog);

    return (
      this.mockParticipants.find(
        (participant: Participant) => participant.activity_id === activity_id && participant.users_id === user_id,
      ) || null
    );
  }

  async findByActivityId(activity_id: number): Promise<Participant[]> {
    componentAccessLog.push(MockParticipantComponent.findByActivityIdLog);

    return this.mockParticipants.filter((participant: Participant) => participant.activity_id === activity_id) || null;
  }

  async findAllByUserId(user_id: number): Promise<Participant[] | null> {
    componentAccessLog.push(MockParticipantComponent.findAllByUserIdLog);

    return this.mockParticipants.filter((participant: Participant) => participant.users_id === user_id);
  }

  async delete(userId: number, activityId: number): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.deleteLog);

    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) => participant.users_id !== userId && participant.activity_id !== activityId,
    );
  }

  async deleteAll(userIds: number[], activity_id: number): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.deleteAllLog);

    this.mockParticipants = this.mockParticipants.filter(
      (participant) => !(participant.activity_id === activity_id && userIds.includes(participant.users_id)),
    );
  }
}

jest.mock('typeorm-transactional', () => ({ Transactional: () => () => {} }));

describe('ActivityServiceTest', () => {
  let activityService: ActivityService;
  let activityComponent: MockActivityComponent;
  let participantComponent: MockParticipantComponent;

  beforeEach(async () => {
    componentAccessLog.length = 0;
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'ActivityService',
          useClass: ActivityServiceImpl,
        },
        {
          provide: 'ActivityComponent',
          useClass: MockActivityComponent,
        },
        {
          provide: 'MemberComponent',
          useClass: MockMemberComponent,
        },
        {
          provide: 'MeetingComponent',
          useClass: MockMeetingComponent,
        },
        {
          provide: 'ParticipantComponent',
          useClass: MockParticipantComponent,
        },
        {
          provide: 'NotificationComponent',
          useClass: MockNotificationComponent,
        },
        {
          provide: 'AuthorityComponent',
          useClass: MockAuthorityComponent,
        },
      ],
    }).compile();

    activityService = module.get<ActivityService>('ActivityService');
    activityComponent = module.get<MockActivityComponent>('ActivityComponent');
    participantComponent = module.get<MockParticipantComponent>('ParticipantComponent');
  });

  describe('createActivityTest', () => {
    it('createActivityTest - SUCCESS', async () => {
      const activityCreateRequest = {
        meeting_id: '64',
        name: 'moeasy1',
        explanation: '모임설명1',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항1',
        onlineYn: true,
        address: Address.createTestDto(),
        detailAddress: '평택',
        participants: [10, 20, 30],
      };

      const result = await activityService.createActivity(activityCreateRequest, 200);
      expect(result).toBe('101');

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockActivityComponent.createLog,
        MockParticipantComponent.saveAllLog,
        MockNotificationComponent.addNotificationsLog,
      ]);
    });
  });

  describe('updateActivityTest', () => {
    it('updateActivityTest - SUCCESS', async () => {
      const activityUpdateRequest = {
        activityId: 300,
        meeting_id: 'C8',
        name: 'moeasy3 수정',
        explanation: '모임설명3 수정',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항3 수정',
        onlineYn: false,
        address: Address.createTestDto(),
        detailAddress: '시흥에서 수정',
        participants: [10, 20],
      };

      await activityService.updateActivity(activityUpdateRequest, 50);

      const result = await activityComponent.findByActivityId(300);
      const participants = await participantComponent.findByActivityId(300);
      const participant = participants.map((participant) => participant.users_id);

      expect(result.activity_id).toBe(300);
      expect(result.meeting_id).toBe(200);
      expect(result.name).toBe('moeasy3 수정');
      expect(result.explanation).toBe('모임설명3 수정');
      expect(result.announcement).toBe('공지사항3 수정');
      expect(result.onlineYn).toBe(false);
      expect(result.detailAddress).toBe('시흥에서 수정');
      expect(participant).toEqual([20, 10]);

      expect(componentAccessLog).toEqual([
        MockAuthorityComponent.validateAuthorityLog,
        MockActivityComponent.findByActivityIdLog,
        MockParticipantComponent.findByActivityIdLog,
        MockParticipantComponent.deleteAllLog,
        MockParticipantComponent.saveAllLog,
        MockNotificationComponent.addNotificationsLog,
        MockActivityComponent.updateLog,
        MockActivityComponent.findByActivityIdLog,
        MockParticipantComponent.findByActivityIdLog,
      ]);
    });

    it('updateActivityTest - NOT_FOUND_ACTIVITY', async () => {
      const activityUpdateRequest = {
        activityId: 999,
        meeting_id: '64',
        name: 'moeasy1 수정',
        explanation: '모임설명1 수정',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항1 수정',
        onlineYn: false,
        address: Address.createTestDto(),
        detailAddress: '평택에서 수정',
        participants: [10, 20, 30],
      };

      await expect(activityService.updateActivity(activityUpdateRequest, 10)).rejects.toThrow(
        ErrorMessageType.NOT_FOUND_ACTIVITY,
      );
    });
  });

  describe('getActivityTest', () => {
    it('getActivityTest - SUCCESS', async () => {
      const result = await activityService.getActivity(200);

      expect(result.name).toBe('moeasy2');
      expect(result.explanation).toBe('모임설명2');
      expect(result.announcement).toBe('공지사항2');
      expect(result.onlineYn).toBe(false);

      expect(componentAccessLog).toEqual([MockActivityComponent.findByActivityIdLog]);
    });

    it('getActivityTest - NOT_FOUND_ACTIVITY', async () => {
      await expect(activityService.getActivity(999)).rejects.toThrow(ErrorMessageType.NOT_FOUND_ACTIVITY);
    });
  });

  describe('getActivityListTest', () => {
    it('getActivityListTest - SUCCESS', async () => {
      const result = await activityService.getActivityList(
        200,
        [ActivityStatusEnum.COMPLETED, ActivityStatusEnum.IN_PROGRESS],
        OrderingOptionEnum.LATEST,
        '64',
      );

      expect(result.activityList[0].name).toBe('moeasy1');
      expect(result.activityList[0].explanation).toBe('모임설명1');
      expect(result.activityList[0].announcement).toBe('공지사항1');
      expect(result.activityList[0].onlineYn).toBe(true);
      expect(result.activityList[0].meetingId).toBe('64');
      expect(result.meetings[0].name).toBe('모임 이름1');
      expect(result.meetings[0].thumbnail).toBe('testThumbnail1.jpg');

      expect(result.activityList[1].name).toBe('moeasy4');
      expect(result.activityList[1].explanation).toBe('모임설명4');
      expect(result.activityList[1].announcement).toBe('공지사항4');
      expect(result.activityList[1].onlineYn).toBe(false);
      expect(result.activityList[1].meetingId).toBe('64');
      expect(result.meetings[1].name).toBe('모임 이름2');
      expect(result.meetings[1].thumbnail).toBe('testThumbnail2.jpg');

      expect(componentAccessLog).toEqual([
        MockActivityComponent.findByMeetingIdLog,
        MockMemberComponent.findByUserIdLog,
        MockMeetingComponent.findByMeetingIdsLog,
      ]);
    });

    it('getActivityListTest - NOT_FOUND_ACTIVITY', async () => {
      await expect(
        activityService.getActivityList(
          999,
          [ActivityStatusEnum.COMPLETED, ActivityStatusEnum.IN_PROGRESS],
          OrderingOptionEnum.LATEST,
        ),
      ).rejects.toThrow(ErrorMessageType.NOT_FOUND_ACTIVITY);
    });
  });

  describe('withdrawTest', () => {
    it('withdrawTest - SUCCESS', async () => {
      const beforeWithdraw = await participantComponent.findByUserIdAndActivityId(200, 200);
      expect(beforeWithdraw).toBeDefined();

      const req = { meetingId: 'C8', activityId: 200 };
      await activityService.withdraw(200, req);

      const afterWithdraw = await participantComponent.findByUserIdAndActivityId(200, 200);
      expect(afterWithdraw).toBeNull();

      expect(componentAccessLog).toEqual([
        MockParticipantComponent.findByUserIdAndActivityIdLog,
        MockMemberComponent.findByUsersAndMeetingIdLog,
        MockParticipantComponent.findByUserIdAndActivityIdLog,
        MockParticipantComponent.deleteLog,
        MockParticipantComponent.findByUserIdAndActivityIdLog,
      ]);
    });

    it('withdrawTest - UNAUTHORIZED_ACCESS  ', async () => {
      const req = { meetingId: 'C8', activityId: 200 };
      await expect(activityService.withdraw(30, req)).rejects.toThrow(ErrorMessageType.UNAUTHORIZED_ACCESS);
    });

    it('withdrawTest - NOT_FOUND_PARTICIPANT', async () => {
      const req = { meetingId: 'C8', activityId: 999 };
      await expect(activityService.withdraw(200, req)).rejects.toThrow(ErrorMessageType.NOT_FOUND_PARTICIPANT);
    });
  });

  describe('deleteActivityTest', () => {
    it('deleteActivityTest - SUCCESS', async () => {
      const req = { meetingId: '64', activityId: 100 };
      const beforeDelete = await activityComponent.findByActivityId(100);
      expect(beforeDelete).toBeDefined();

      await activityService.delete(100, req);

      const afterDelete = await activityComponent.findByActivityId(100);
      expect(afterDelete).toBeNull();

      expect(componentAccessLog).toEqual([
        MockActivityComponent.findByActivityIdLog,
        MockAuthorityComponent.validateAuthorityLog,
        MockActivityComponent.deleteLog,
        MockActivityComponent.findByActivityIdLog,
      ]);
    });
  });
});
