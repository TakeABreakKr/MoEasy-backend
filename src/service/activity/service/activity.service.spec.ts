import { Test, TestingModule } from '@nestjs/testing';
import { ActivityService } from '@service/activity/service//activity.service.interface';
import { ActivityServiceImpl } from '@service/activity/service/activity.service';
import { MeetingComponent } from '@domain/meeting/component/meeting.component.interface';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';
import { Member } from '@domain/member/entity/member.entity';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { AuthorityComponent } from '@domain/member/component/authority.component.interface';
import { NotificationComponent } from '@domain/notification/component/notification.component.interface';
import { ActivityComponent } from '@domain/activity/component/activity.component.interface';
import { ParticipantComponent } from '@root/domain/activity/component/participant.component.interface';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityCreateVO } from '@domain/activity/vo/activity.create.vo';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ActivityStatusEnum } from '@enums/activityStatusEnum';
import { OrderingOptionEnum } from '@enums/ordering.option.enum';
import { Address } from '@domain/activity/entity/address.embedded';
import { MeetingCategoryEnum } from '@enums/meeting.category.enum';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

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
      meetingId: 80,
      name: '모임 이름1',
      explanation: '모임 설명1',
      limit: 10,
      thumbnail: 'testThumbnail1.jpg',
      canJoin: false,
      category: MeetingCategoryEnum.GAME,
      publicYn: true,
    }),
    Meeting.createForTest({
      meetingId: 200,
      name: '모임 이름2',
      explanation: '모임 설명2',
      limit: 10,
      thumbnail: 'testThumbnail2.jpg',
      canJoin: true,
      category: MeetingCategoryEnum.GAME,
      publicYn: true,
    }),
  ];

  async findByMeetingId(id: number): Promise<Meeting | null> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdLog);

    const meeting = this.mockMeetings.find((meeting) => meeting.id === id);
    return meeting;
  }

  async findByMeetingIds(ids: number[]): Promise<Meeting[]> {
    componentAccessLog.push(MockMeetingComponent.findByMeetingIdsLog);

    return this.mockMeetings.filter((meeting) => ids.includes(meeting.id));
  }

  async create(createMeetingDto: CreateMeetingDto): Promise<Meeting> {
    componentAccessLog.push(MockMeetingComponent.createLog);

    const meeting = Meeting.createForTest({ ...createMeetingDto, meetingId: 3 });

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

    this.mockMeetings = this.mockMeetings.filter((meeting) => meeting.id !== id);
  }

  async getNewMeetings(): Promise<Meeting[]> {
    return this.mockMeetings;
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
      userId: 200,
      authority: AuthorityEnum.MANAGER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      userId: 30,
      authority: AuthorityEnum.OWNER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      userId: 20,
      authority: AuthorityEnum.OWNER,
      applicationMessage: '꼭 가입하고 싶습니다.',
    }),
    Member.create({
      meetingId: 200,
      userId: 200,
      authority: AuthorityEnum.MEMBER,
    }),
  ];

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndMeetingIdLog);

    const member = this.mockMembers.find((member) => member.userId === userId && member.meetingId === meetingId);
    return member || null;
  }

  async findByUsersAndAuthorities(userId: number, authorities: AuthorityEnumType[]): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByUsersAndAuthoritiesLog);

    return this.mockMembers.filter((member) => member.userId === userId && authorities.includes(member.authority));
  }

  async findByUserId(userId: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByUserIdLog);

    return this.mockMembers.filter((member) => member.userId === userId);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    componentAccessLog.push(MockMemberComponent.findByMeetingIdLog);

    return this.mockMembers.filter((member) => member.meetingId === meetingId);
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

  async deleteByUsersAndMeetingId(userId: number, meeting_id: number): Promise<void> {
    componentAccessLog.push(MockMemberComponent.deleteByUsersAndMeetingIdLog);

    this.mockMembers = this.mockMembers.filter(
      (member) => !(member.userId === userId && member.meetingId === meeting_id),
    );
  }

  async saveAll(members: Member[]): Promise<void> {
    componentAccessLog.push(MockMemberComponent.saveAllLog);

    members.forEach((member) => {
      this.mockMembers.push(member);
    });
  }

  async getMemberCount(meetingId: number): Promise<number> {
    return this.mockMembers.filter((member) => member.meetingId === meetingId).length;
  }

  async getMostPopularMeetingIds(): Promise<number[]> {
    return this.mockMembers.map((member) => member.meetingId);
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
      thumbnail: 'testThumbnail1.jpg',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항1',
      onlineYn: true,
      address: Address.createForTest(),
      detailAddress: '평택',
      participantLimit: 20,
    }),
    Activity.createForTest(101, {
      meetingId: '64',
      name: 'moeasy4',
      explanation: '모임설명4',
      thumbnail: 'testThumbnail4.jpg',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항4',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '인천',
      participantLimit: 20,
    }),
    Activity.createForTest(200, {
      meetingId: 'C8',
      name: 'moeasy2',
      explanation: '모임설명2',
      thumbnail: 'testThumbnail2.jpg',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항2',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '수원',
      participantLimit: 20,
    }),
    Activity.createForTest(300, {
      meetingId: 'C8',
      name: 'moeasy3',
      explanation: '모임설명3',
      thumbnail: 'testThumbnail3.jpg',
      startDate: new Date(),
      endDate: new Date(),
      reminder: [],
      announcement: '공지사항3',
      onlineYn: false,
      address: Address.createForTest(),
      detailAddress: '시흥',
      participantLimit: 20,
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

    const index = this.mockActivitys.findIndex((item) => item.id === activity.id);
    this.mockActivitys[index] = activity;
  }

  async findByActivityId(activityId: number): Promise<Activity | null> {
    componentAccessLog.push(MockActivityComponent.findByActivityIdLog);

    return this.mockActivitys.find((activity: Activity) => activity.id === activityId) || null;
  }

  async findByMeetingId(meetingId: number): Promise<Activity[]> {
    componentAccessLog.push(MockActivityComponent.findByMeetingIdLog);

    return this.mockActivitys.filter((activity: Activity) => activity.meetingId === meetingId);
  }

  async findAllByActivityIds(activityIds: number[]): Promise<Activity[]> {
    componentAccessLog.push(MockActivityComponent.findAllByActivityIdsLog);

    return this.mockActivitys.filter((activity: Activity) => activityIds.includes(activity.id));
  }

  async delete(activityId: number): Promise<void> {
    componentAccessLog.push(MockActivityComponent.deleteLog);

    this.mockActivitys = this.mockActivitys.filter((activity: Activity) => activity.id !== activityId);
  }

  async getClosingTimeActivities(): Promise<Partial<Activity>[]> {
    return [];
  }

  async getUpcomingActivities(): Promise<Activity[]> {
    return [];
  }

  async getDaysUntilStart(): Promise<number> {
    return 0;
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
    Participant.create({ userId: 200, activityId: 100 }),
    Participant.create({ userId: 30, activityId: 100 }),
    Participant.create({ userId: 200, activityId: 200 }),
    Participant.create({ userId: 30, activityId: 200 }),
    Participant.create({ userId: 20, activityId: 300 }),
    Participant.create({ userId: 70, activityId: 300 }),
  ];

  async saveAll(participants: Participant[]): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.saveAllLog);

    this.mockParticipants.push(...participants);
  }

  async findByUserIdAndActivityId(userId: number, activityId: number): Promise<Participant | null> {
    componentAccessLog.push(MockParticipantComponent.findByUserIdAndActivityIdLog);

    return (
      this.mockParticipants.find(
        (participant: Participant) => participant.activityId === activityId && participant.userId === userId,
      ) || null
    );
  }

  async findByActivityId(activityId: number): Promise<Participant[]> {
    componentAccessLog.push(MockParticipantComponent.findByActivityIdLog);

    return this.mockParticipants.filter((participant: Participant) => participant.activityId === activityId);
  }

  async findAllByUserId(userId: number): Promise<Participant[] | null> {
    componentAccessLog.push(MockParticipantComponent.findAllByUserIdLog);

    return this.mockParticipants.filter((participant: Participant) => participant.userId === userId) || null;
  }

  async delete(userId: number, activityId: number): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.deleteLog);

    this.mockParticipants = this.mockParticipants.filter(
      (participant: Participant) => !(participant.userId === userId && participant.activityId === activityId),
    );
  }

  async deleteAll(userIds: number[], activity_id: number): Promise<void> {
    componentAccessLog.push(MockParticipantComponent.deleteAllLog);

    this.mockParticipants = this.mockParticipants.filter(
      (participant) => !(participant.activityId === activity_id && userIds.includes(participant.userId)),
    );
  }

  async getHomeActivityParticipants(): Promise<ActivityParticipantDto[]> {
    return [];
  }

  async getParticipantCount(activityId: number): Promise<number> {
    return this.mockParticipants.filter((participant) => participant.activityId === activityId).length;
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
        meetingId: '64',
        name: 'moeasy1',
        explanation: '모임설명1',
        thumbnail: 'testThumbnail1.jpg',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항1',
        onlineYn: true,
        address: Address.createTestDto(),
        detailAddress: '평택',
        participants: [10, 20, 30],
        participantLimit: 10,
        onlineLink: 'https://www.naver.com',
      };

      const requesterId = 200;
      const result = await activityService.createActivity(activityCreateRequest, requesterId);
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
      const activityId = 300;
      const activityUpdateRequest = {
        activityId: activityId,
        meetingId: 'C8',
        name: 'moeasy3 수정',
        explanation: '모임설명3 수정',
        thumbnail: 'testThumbnail3.jpg',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항3 수정',
        onlineYn: false,
        address: Address.createTestDto(),
        detailAddress: '시흥에서 수정',
        participants: [10, 20],
        participantLimit: 10,
        onlineLink: 'https://www.naver.com',
      };

      const requesterId = 200;
      await activityService.updateActivity(activityUpdateRequest, requesterId);

      const result = await activityComponent.findByActivityId(activityId);
      const participants = await participantComponent.findByActivityId(activityId);
      const participant = participants.map((participant) => participant.userId);

      expect(result.id).toBe(300);
      expect(result.meetingId).toBe(200);
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
        meetingId: '64',
        name: 'moeasy1 수정',
        explanation: '모임설명1 수정',
        thumbnail: 'testThumbnail1.jpg',
        startDate: new Date(),
        endDate: new Date(),
        reminder: [],
        announcement: '공지사항1 수정',
        onlineYn: false,
        address: Address.createTestDto(),
        detailAddress: '평택에서 수정',
        participants: [10, 20, 30],
        participantLimit: 10,
        onlineLink: 'https://www.naver.com',
      };

      const requesterId = 10;
      await expect(activityService.updateActivity(activityUpdateRequest, requesterId)).rejects.toThrow(
        ErrorMessageType.NOT_FOUND_ACTIVITY,
      );
    });
  });

  describe('getActivityTest', () => {
    it('getActivityTest - SUCCESS', async () => {
      const activityId = 200;
      const result = await activityService.getActivity(activityId);

      expect(result.name).toBe('moeasy2');
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
      const requesterId = 200;
      const meetingId = '64';
      const result = await activityService.getActivityList(
        requesterId,
        [ActivityStatusEnum.COMPLETED, ActivityStatusEnum.IN_PROGRESS],
        OrderingOptionEnum.LATEST,
        meetingId,
      );

      expect(result.activityList[0].name).toBe('moeasy1');
      expect(result.activityList[0].onlineYn).toBe(true);
      expect(result.activityList[0].meetingId).toBe('64');
      expect(result.meetings[0].name).toBe('모임 이름1');
      expect(result.meetings[0].thumbnail).toBe('testThumbnail1.jpg');

      expect(result.activityList[1].name).toBe('moeasy4');
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
      const requesterId = 999;
      await expect(
        activityService.getActivityList(
          requesterId,
          [ActivityStatusEnum.COMPLETED, ActivityStatusEnum.IN_PROGRESS],
          OrderingOptionEnum.LATEST,
        ),
      ).rejects.toThrow(ErrorMessageType.NOT_FOUND_ACTIVITY);
    });
  });

  describe('withdrawTest', () => {
    it('withdrawTest - SUCCESS', async () => {
      const usersId = 200;
      const activityId = 200;

      const beforeWithdraw = await participantComponent.findByUserIdAndActivityId(usersId, activityId);
      expect(beforeWithdraw).toBeDefined();

      const req = { meetingId: 'C8', activityId: activityId };
      await activityService.withdraw(200, req);

      const afterWithdraw = await participantComponent.findByUserIdAndActivityId(usersId, activityId);
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
