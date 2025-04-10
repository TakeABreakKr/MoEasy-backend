import { Test, TestingModule } from '@nestjs/testing';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { UsersComponentImpl } from '@domain/user/component/users.component';
import { Users } from '@domain/user/entity/users.entity';
import { Settings } from '@domain/user/entity/settings.embedded';
import { DiscordProfileDto } from '@domain/user/dto/discord.profile.dto';

class MockUsersDao implements UsersDao {
  private mockUsers: Users[] = [
    Users.createForTest({
      id: 30,
      discordId: 'discordIdOne',
      username: 'kimmoiji',
      avatar: 'avatar1',
      email: 'kimmoiji@example.com',
      explanation: 'explanation1',
      profileImageId: 20,
      settings: Settings.create({ allowNotificationYn: false }),
    }),
    Users.createForTest({
      id: 50,
      discordId: 'discordIdTwo',
      username: 'Parkmoiji',
      avatar: 'avatar2',
      email: 'Parkmoiji@example.com',
      explanation: 'explanation2',
      profileImageId: 40,
      settings: Settings.create({ allowNotificationYn: false }),
    }),
  ];

  async findById(id: number): Promise<Users | null> {
    const user = this.mockUsers.find((user) => user.id === id);

    return user || null;
  }

  async findByIds(userIds: number[]): Promise<Users[]> {
    return this.mockUsers.filter((user) => userIds.includes(user.id));
  }

  async findByDiscordId(discordId: string): Promise<Users | null> {
    const user = this.mockUsers.find((user) => user.discordId === discordId);

    return user || null;
  }

  async createUsers(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = Users.createForTest({
      id: 80,
      discordId: profile.id,
      username: profile.username,
      avatar: profile.avatar,
      email: profile.email,
      explanation: 'explanation3',
      profileImageId: 50,
      settings: Settings.create({ allowNotificationYn: false }),
    });

    this.mockUsers.push(user);

    return user;
  }
}

describe('UsersComponent', () => {
  let usersComponent: UsersComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UsersDao',
          useClass: MockUsersDao,
        },
        {
          provide: 'UsersComponent',
          useClass: UsersComponentImpl,
        },
      ],
    }).compile();
    usersComponent = module.get<UsersComponent>('UsersComponent');
  });

  it('findByDiscordIdTest', async () => {
    const user = await usersComponent.findByDiscordId('discordIdOne');

    expect(user.id).toBe(30);
    expect(user.discordId).toBe('discordIdOne');
    expect(user.username).toBe('kimmoiji');
    expect(user.avatar).toBe('avatar1');
    expect(user.email).toBe('kimmoiji@example.com');
  });

  it('createUsersTest', async () => {
    const profile: DiscordProfileDto = {
      id: 'discordIdThree',
      username: 'kimmoiji',
      avatar: 'avatar3',
      email: 'kimmoiji@example.com',
    };
    const user = await usersComponent.createUsers(profile);

    expect(user.id).toBe(80);
    expect(user.discordId).toBe('discordIdThree');
    expect(user.username).toBe('kimmoiji');
    expect(user.avatar).toBe('avatar3');
    expect(user.email).toBe('kimmoiji@example.com');
  });

  it('findByIdTest', async () => {
    const userId = 30;

    const user = await usersComponent.findById(userId);

    expect(user.id).toBe(30);
    expect(user.discordId).toBe('discordIdOne');
    expect(user.username).toBe('kimmoiji');
    expect(user.avatar).toBe('avatar1');
    expect(user.email).toBe('kimmoiji@example.com');
  });

  it('findByIdsTest', async () => {
    const userIds = [30, 50];

    const users = await usersComponent.findByIds(userIds);

    expect(users[0].id).toBe(30);
    expect(users[0].discordId).toBe('discordIdOne');
    expect(users[0].username).toBe('kimmoiji');
    expect(users[0].avatar).toBe('avatar1');
    expect(users[0].email).toBe('kimmoiji@example.com');

    expect(users[1].id).toBe(50);
    expect(users[1].discordId).toBe('discordIdTwo');
    expect(users[1].username).toBe('Parkmoiji');
    expect(users[1].avatar).toBe('avatar2');
    expect(users[1].email).toBe('Parkmoiji@example.com');
  });
});
