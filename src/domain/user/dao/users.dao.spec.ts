import { FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Users } from '../entity/users.entity';
import { UsersDao } from './users.dao.interface';
import { UsersDaoImpl } from './users.dao';
import { Settings } from '../entity/settings.embedded';
import { DiscordProfileDto } from '../dto/discord.profile.dto';

class MockUsersRepository extends Repository<Users> {
  private mockUsers: Users[] = [
    Users.createForTest({
      users_id: 30,
      discord_id: 'discordIdOne',
      username: 'kimmoiji',
      avatar: 'avatar1',
      email: 'kimmoiji@example.com',
      explanation: 'explanation1',
      settings: Settings.create({ allowNotificationYn: false }),
    }),
    Users.createForTest({
      users_id: 50,
      discord_id: 'discordIdTwo',
      username: 'Parkmoiji',
      avatar: 'avatar2',
      email: 'Parkmoiji@example.com',
      explanation: 'explanation2',
      settings: Settings.create({ allowNotificationYn: false }),
    }),
  ];

  async save(users: Users | Users[]): Promise<Users[]> {
    const toSave = Array.isArray(users) ? users : [users];
    this.mockUsers.push(...toSave);

    return toSave;
  }

  async findBy(where: FindOptionsWhere<Users>): Promise<Users[]> {
    if (where.users_id instanceof FindOperator && Array.isArray(where.users_id.value)) {
      const ids = where.users_id.value;
      return this.mockUsers.filter((users) => ids.includes(users.users_id));
    }

    return [];
  }

  async findOneBy(where: FindOptionsWhere<Users>): Promise<Users | null> {
    const users = this.mockUsers.find((users) => {
      if (typeof where.users_id === 'number' || typeof where.users_id === 'string') {
        return users.users_id === where.users_id;
      }
      if (typeof where.discord_id === 'string') {
        return users.discord_id === where.discord_id;
      }
      return false;
    });

    return users || null;
  }
}

describe('UsersDao', () => {
  let usersDao: UsersDao;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'UsersDao', useClass: UsersDaoImpl },
        { provide: getRepositoryToken(Users), useClass: MockUsersRepository },
      ],
    }).compile();
    usersDao = module.get<UsersDao>('UsersDao');
  });

  it('findByIdTest', async () => {
    const result = await usersDao.findById(30);

    expect(result.users_id).toBe(30);
    expect(result.discord_id).toBe('discordIdOne');
    expect(result.username).toBe('kimmoiji');
    expect(result.avatar).toBe('avatar1');
    expect(result.email).toBe('kimmoiji@example.com');
  });

  it('findByIdsTest', async () => {
    const result = await usersDao.findByIds([30, 50]);

    expect(result[0].users_id).toBe(30);
    expect(result[0].discord_id).toBe('discordIdOne');
    expect(result[0].username).toBe('kimmoiji');
    expect(result[0].avatar).toBe('avatar1');
    expect(result[0].email).toBe('kimmoiji@example.com');

    expect(result[1].users_id).toBe(50);
    expect(result[1].discord_id).toBe('discordIdTwo');
    expect(result[1].username).toBe('Parkmoiji');
    expect(result[1].avatar).toBe('avatar2');
    expect(result[1].email).toBe('Parkmoiji@example.com');
  });

  it('findByDiscordIdTest', async () => {
    const result = await usersDao.findByDiscordId('discordIdOne');

    expect(result.users_id).toBe(30);
    expect(result.discord_id).toBe('discordIdOne');
    expect(result.username).toBe('kimmoiji');
    expect(result.avatar).toBe('avatar1');
    expect(result.email).toBe('kimmoiji@example.com');
  });

  it('createTest', async () => {
    const props: DiscordProfileDto = {
      id: '60',
      username: 'Parkmoiji',
      avatar: 'avatar',
      email: 'Parkmoiji@example.com',
    };
    const result = await usersDao.createUsers(props);

    expect(result.discord_id).toBe('60');
    expect(result.username).toBe('Parkmoiji');
    expect(result.avatar).toBe('avatar');
    expect(result.email).toBe('Parkmoiji@example.com');
  });
});
