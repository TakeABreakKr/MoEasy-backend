import { MeetingService } from '@domain/meeting/service/meeting.service.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { MeetingServiceImpl } from '@domain/meeting/service/meeting.service';
import { FileService } from '@file/service/file.service';
import { MeetingDao } from '@domain/meeting/dao/meeting.dao';
import { MemberDao } from '@domain/meeting/dao/member.dao';
import { KeywordDao } from '@domain/meeting/dao/keyword.dao';
import { UsersDao } from '@domain/user/dao/users.dao';
import { NotificationDao } from '@domain/notification/dao/notification.dao';
import { AuthorityComponent } from '@domain/meeting/component/authority.component';
import { MeetingCreateRequest } from '@domain/meeting/dto/request/meeting.create.request';
import { AuthUser } from '@decorator/token.decorator';
import { BadRequestException } from '@nestjs/common';

describe('MeetingService', () => {
  let meetingService: MeetingServiceImpl;
  let fileService: FileService;
  let meetingDao: MeetingDao;
  let memberDao: MemberDao;
  let keywordDao: KeywordDao;
  let usersDao: UsersDao;
  let notificationDao: NotificationDao;
  let authorityComponent: AuthorityComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MeetingServiceImpl,
        {
          provide: 'FileService',
          useValue: { uploadThumbnailFile: jest.fn().mockResolvedValue('thumbnail_path') },
        },
        {
          provide: MeetingDao,
          useValue: { create: jest.fn().mockResolvedValue({ meeting_id: 1, name: 'Test Meeting' }) },
        },
        {
          provide: MemberDao,
          useValue: { countByMeetingId: jest.fn().mockResolvedValue(0), saveAll: jest.fn() },
        },
        {
          provide: KeywordDao,
          useValue: { countByMeetingId: jest.fn().mockResolvedValue(0), saveAll: jest.fn() },
        },
        {
          provide: UsersDao,
          useValue: { findByIds: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: NotificationDao,
          useValue: { findByIds: jest.fn().mockResolvedValue([]) },
        },
        {
          provide: AuthorityComponent,
          useValue: {},
        },
      ],
    }).compile();
    meetingService = module.get<MeetingServiceImpl>(MeetingServiceImpl);
    fileService = module.get<FileService>(FileService);
    meetingDao = module.get<MeetingDao>(MeetingDao);
    memberDao = module.get<MemberDao>(MemberDao);
    keywordDao = module.get<KeywordDao>(KeywordDao);
    usersDao = module.get<UsersDao>(UsersDao);
    notificationDao = module.get<NotificationDao>(NotificationDao);
    authorityComponent = module.get<AuthorityComponent>(AuthorityComponent);
  });

  const user: AuthUser = {
    id: 1,
    name: 'test user',
    issueDate: Date.now(),
  };

  it('createMeetingTest', async () => {
    const req: MeetingCreateRequest = {
      name: 'New Meeting',
      explanation: 'this is meeting',
      limit: 1,
      thumbnail: null,
      canJoin: false,
      keywords: [],
      members: [],
    };
    const result = await meetingService.createMeeting(req, user.id);

    expect(result).toBe('1');
    expect(meetingDao.create).toHaveBeenCalledTimes(1);
    expect(keywordDao.saveAll).toHaveBeenCalledTimes(1);
    expect(memberDao.saveAll).toHaveBeenCalledTimes(1);
  });

  it('createMeetingTest - fail case : limit exceeded', async () => {
    jest.spyOn(keywordDao, 'countByMeetingId').mockResolvedValueOnce(11);

    const req: MeetingCreateRequest = {
      name: 'New Meeting',
      explanation: 'this is meeting',
      limit: 1,
      thumbnail: null,
      canJoin: false,
      keywords: ['test', 'meeting', 'fish', 'animal', 'rabbit', 'home', 'i want', 'go', 'home', 'wanna', 'go home'],
      members: [],
    };

    await expect(meetingService.createMeeting(req, user.id)).rejects.toThrowError(BadRequestException);
  });

  it('updateMeetingTest', async () => {});
  it('updateMeetingThumbnailTest', async () => {});
  it('deleteMeetingTest', async () => {});
  it('getMeetingTest', async () => {});
  it('getMeetingListTest', async () => {});
  it('toGetMeetingResponseTest', async () => {});
});
