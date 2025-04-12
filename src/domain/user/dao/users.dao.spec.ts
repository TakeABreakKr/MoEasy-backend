import { FindOperator, FindOptionsWhere, Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { UsersDaoImpl } from '@domain/user/dao/users.dao';
import { Settings } from '@domain/user/entity/settings.embedded';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';

class MockUsersRepository extends Repository<Users> {
  private mockUsers: Users[] = [
    Users.createForTest({
      id: 30,
      discordId: 'discordIdOne',
      username: 'kimmoiji',
      email: 'kimmoiji@example.com',
      explanation: 'explanation1',
      profileImageId: 80,
      settings: Settings.create({ allowNotificationYn: false }),
    }),
    Users.createForTest({
      id: 50,
      discordId: 'discordIdTwo',
      username: 'Parkmoiji',
      email: 'Parkmoiji@example.com',
      explanation: 'explanation2',
      profileImageId: 60,
      settings: Settings.create({ allowNotificationYn: false }),
    }),
  ];

  async save(users: Users | Users[]): Promise<Users[]> {
    const toSave = Array.isArray(users) ? users : [users];
    this.mockUsers.push(...toSave);

    return toSave;
  }

  async findBy(where: FindOptionsWhere<Users>): Promise<Users[]> {
    if (where.id instanceof FindOperator && Array.isArray(where.id.value)) {
      const ids = where.id.value;
      return this.mockUsers.filter((users) => ids.includes(users.id));
    }

    return [];
  }

  async findOneBy(where: FindOptionsWhere<Users>): Promise<Users | null> {
    const users = this.mockUsers.find((users) => {
      if (typeof where.id === 'number' || typeof where.id === 'string') {
        return users.id === where.id;
      }
      if (typeof where.discordId === 'string') {
        return users.discordId === where.discordId;
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
    const userId = 30;

    const result = await usersDao.findById(userId);

    expect(result.id).toBe(userId);
    expect(result.discordId).toBe('discordIdOne');
    expect(result.username).toBe('kimmoiji');
    expect(result.email).toBe('kimmoiji@example.com');
    expect(result.profileImageId).toBe(80);
  });

  it('findByIdsTest', async () => {
    const userIds = [30, 50];

    const result = await usersDao.findByIds(userIds);

    expect(result[0].id).toBe(30);
    expect(result[0].discordId).toBe('discordIdOne');
    expect(result[0].username).toBe('kimmoiji');
    expect(result[0].email).toBe('kimmoiji@example.com');
    expect(result[0].profileImageId).toBe(80);

    expect(result[1].id).toBe(50);
    expect(result[1].discordId).toBe('discordIdTwo');
    expect(result[1].username).toBe('Parkmoiji');
    expect(result[1].email).toBe('Parkmoiji@example.com');
    expect(result[1].profileImageId).toBe(60);
  });

  it('findByDiscordIdTest', async () => {
    const result = await usersDao.findByDiscordId('discordIdOne');

    expect(result.id).toBe(30);
    expect(result.discordId).toBe('discordIdOne');
    expect(result.username).toBe('kimmoiji');
    expect(result.email).toBe('kimmoiji@example.com');
    expect(result.profileImageId).toBe(80);
  });

  it('createTest', async () => {
    const profile: UsersCreateDto = {
      discordId: 'discordIdThree',
      username: 'Parkmoiji',
      email: 'Parkmoiji@example.com',
      profileImageId: 100,
      explanation: 'explanation3',
      settings: {
        allowNotificationYn: false,
      },
    };
    const result = await usersDao.createUsers(profile);

    expect(result.discordId).toBe('discordIdThree');
    expect(result.username).toBe('Parkmoiji');
    expect(result.email).toBe('Parkmoiji@example.com');
    expect(result.profileImageId).toBe(100);
  });
});
