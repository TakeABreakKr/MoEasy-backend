import { Test, TestingModule } from '@nestjs/testing';
import { DiscordComponentImpl } from '@domain/discord/component/discord.component';
import { DiscordComponent } from '@domain/discord/component/discord.component.interface';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';

class MockConfigService extends ConfigService {
  private readonly TEST_CONFIG = {
    'discord.client_id': 'test-client-id',
    'discord.client_secret': 'test-client-secret',
    'discord.host': 'https://discord.com',
    host: 'http://localhost:3000',
  };

  get(key: string) {
    return this.TEST_CONFIG[key];
  }
}

class MockHttpService {
  private tokenResponse = {
    data: {
      token_type: 'Bearer',
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      expires_in: 604800,
      scope: 'identify email',
    },
  };

  private userResponse = {
    data: {
      id: '123',
      username: 'momo',
      discriminator: '1234',
      avatar: 'avatar',
      global_name: 'global name',
      public_flags: 0,
      email: 'moeasy@example.com',
    },
  };

  axiosRef = {
    request: jest.fn((config) => {
      if (config.url === '/api/v10/oauth2/token') {
        return Promise.resolve(this.tokenResponse);
      }
      if (config.url === '/api/v10/users/@me') {
        return Promise.resolve(this.userResponse);
      }
    }),
  };
}

describe('DiscordComponent', () => {
  let discordComponent: DiscordComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'DiscordComponent',
          useClass: DiscordComponentImpl,
        },
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
        {
          provide: HttpService,
          useClass: MockHttpService,
        },
      ],
    }).compile();

    discordComponent = module.get<DiscordComponent>('DiscordComponent');
  });

  it('getTokensTest', async () => {
    const code = 'test-authorization-code';

    const result = await discordComponent.getTokens(code);

    expect(result).toEqual({
      accessToken: 'Bearer test-access-token',
      refreshToken: 'Bearer test-refresh-token',
    });
  });

  it('getUserTest', async () => {
    const result = await discordComponent.getUser({
      accessToken: 'Bearer test-token',
      refreshToken: 'Bearer refresh-token',
    });

    expect(result).toEqual({
      id: '123',
      username: 'momo',
      discriminator: '1234',
      avatar: 'avatar',
      global_name: 'global name',
      public_flags: 0,
      email: 'moeasy@example.com',
    });
  });
});
