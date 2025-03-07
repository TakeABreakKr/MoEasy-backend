import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscordComponent } from '@root/domain/discord/component/discord.component.interface';
import { UsersComponent } from '@root/domain/user/component/users.component.interface';
import { Users } from '@root/domain/user/entity/users.entity';
import { AuthService } from '@service/auth/service/auth.service';
import { TokenDto } from '@service/auth/dto/token.dto';
import { ErrorMessageType } from '@root/enums/error.message.enum';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@root/decorator/token.decorator';
import { DiscordUserByTokenDto } from '@root/domain/discord/dto/response/discord.authorized.info.response';
import { AuthCallbackResponse } from '@service/auth/dto/response/auth.callback.response';

const TEST_CONFIG = {
  'auth.ACCESS_TOKEN_SECRET_KEY': 'moeasy-secret-key',
  'auth.REFRESH_TOKEN_SECRET_KEY': 'moeasy-refresh-key',
  'discord.client_id': 'test-client-id',
  host: 'http://localhost:3000',
  'frontend.host': 'http://localhost:3000',
};
class MockConfigService extends ConfigService {
  get(key: string) {
    return TEST_CONFIG[key];
  }
}

class MockJwtService {
  sign = jest.fn((user: AuthUser, options: { secret: string }) => {
    if (options.secret === 'moeasy-secret-key') {
      return 'moeasy-access-token';
    }
    if (options.secret === 'moeasy-refresh-key') {
      return 'moeasy-refresh-token';
    }
    return 'unknown-token';
  });

  verify = jest.fn((token: string) => {
    if (token === 'valid-token') {
      return {
        id: 1,
        name: 'moeasy',
        issueDate: Date.now(),
      };
    }
    throw new UnauthorizedException(ErrorMessageType.INVALID_TOKEN);
  });
}

class MockUsersComponent implements UsersComponent {
  private mockUsers: Users[] = [
    Users.createForTest({
      users_id: 200,
      discord_id: 'discordIdOne',
      username: 'kimmoiji',
      avatar: 'avatar1',
      email: 'kimmoiji@test.com',
      explanation: 'explanation1',
      settings: { allowNotificationYn: true },
    }),
    Users.createForTest({
      users_id: 512,
      discord_id: 'discordIdTwo',
      username: 'parkmoiji',
      avatar: 'avatar2',
      email: 'Parkmoiji@test.com',
      explanation: 'explanation2',
      settings: { allowNotificationYn: true },
    }),
  ];

  async findById(user_id: number): Promise<Users | null> {
    const user = this.mockUsers.find((user) => user.users_id === user_id);
    return user || null;
  }

  async findByIds(): Promise<Users[]> {
    const users: Users[] = this.mockUsers;
    return users;
  }

  async createUsers(): Promise<Users> {
    const users = Users.createForTest({
      users_id: 300,
      discord_id: 'discordIdThree',
      username: 'momo',
      avatar: 'avatar3',
      email: 'moeasy@naver.com',
      explanation: 'explanation3',
      settings: { allowNotificationYn: true },
    });
    return users;
  }

  async findByDiscordId(discord_id: string): Promise<Users | null> {
    const users = this.mockUsers.find((user) => user.discord_id === discord_id);
    return users || null;
  }
}

class MockDiscordComponent implements DiscordComponent {
  async getTokens(code: string): Promise<TokenDto> {
    if (code === 'valid-code') {
      return {
        accessToken: 'discord-access-token',
        refreshToken: 'discord-refresh-token',
      };
    }

    throw new Error(ErrorMessageType.TOKEN_ISSUANCE_FAILED);
  }

  async getUser(token: TokenDto): Promise<DiscordUserByTokenDto> {
    if (token.accessToken === 'discord-access-token' && token.refreshToken === 'discord-refresh-token') {
      return {
        id: '123',
        username: 'momo',
        discriminator: '1234',
        avatar: 'avatar',
        global_name: 'global name',
        public_flags: 0,
        email: 'email',
      };
    }
  }
}

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: 'UsersComponent',
          useClass: MockUsersComponent,
        },
        {
          provide: 'DiscordComponent',
          useClass: MockDiscordComponent,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: JwtService,
          useClass: MockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('getLoginUrlTest', () => {
    it('getLoginUrlTest', async () => {
      const result = authService.getLoginUrl();
      const clientId = TEST_CONFIG['discord.client_id'];
      const redirectUri = TEST_CONFIG.host + '/auth/callback';

      expect(result).toBe(
        `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify%20email`,
      );
    });
  });

  describe('callbackTest', () => {
    const mockResponse: AuthCallbackResponse = {
      cookie: jest.fn().mockReturnThis(),
      redirect: jest.fn().mockReturnThis(),
    };

    it('callbackTest - SUCCESS', async () => {
      const code = 'valid-code';
      await authService.callback(code, mockResponse);

      expect(mockResponse.cookie).toHaveBeenCalledWith('AccessToken', 'moeasy-access-token');
      expect(mockResponse.cookie).toHaveBeenCalledWith('RefreshToken', 'moeasy-refresh-token');
      expect(mockResponse.redirect).toHaveBeenCalledWith('http://localhost:3000');
    });

    it('callbackTest - DISCORD_AUTH_CODE_ERROR', async () => {
      const code = '';
      await expect(authService.callback(code, mockResponse)).rejects.toThrow(
        new BadRequestException(ErrorMessageType.DISCORD_AUTH_CODE_ERROR),
      );
    });

    it('callbackTest - TOKEN_ISSUANCE_FAILED', async () => {
      const code = 'invalid-code';
      await expect(authService.callback(code, mockResponse)).rejects.toThrow(
        new UnauthorizedException(ErrorMessageType.TOKEN_ISSUANCE_FAILED),
      );
    });
  });

  describe('refreshAccessTokenTest', () => {
    it('refreshAccessTokenTest - SUCCESS', () => {
      const refreshToken = 'valid-token';
      const result = authService.refreshAccessToken(refreshToken);

      expect(result).toBe('moeasy-access-token');
    });

    it('refreshAccessTokenTest - INVALID_TOKEN', () => {
      const refreshToken = 'invalid-token';
      expect(() => authService.refreshAccessToken(refreshToken)).toThrow(ErrorMessageType.INVALID_TOKEN);
    });
  });
});
