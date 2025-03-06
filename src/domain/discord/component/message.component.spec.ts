import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { MessageComponentImpl } from '@domain/discord/component/message.component';
import { MessageComponent } from '@domain/discord/component/message.component.interface';

class MockConfigService extends ConfigService {
  private readonly TEST_CONFIG = {
    'discord.token': 'test-discord-token',
    'discord.host': 'https://discord.com',
    host: 'http://localhost:3000',
  };

  get(key: string) {
    return this.TEST_CONFIG[key];
  }
}

class MockHttpService {
  public channelResponse = {
    data: {
      id: '345612',
      type: 1,
      recipients: [
        {
          id: 'test-recipient-id',
        },
      ],
    },
  };

  axiosRef = {
    request: jest.fn((config) => {
      if (config.url === `/api/v10/channels/moeasy-channelId/messages`) {
        return Promise.resolve();
      }
      if (config.url === '/api/v10/users/@me/channels') {
        return Promise.resolve(this.channelResponse);
      }
    }),
  };
}

describe('MessageComponent', () => {
  let messageComponentImpl: MessageComponent;
  let httpService: MockHttpService;
  let configService: MockConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'MessageComponent',
          useClass: MessageComponentImpl,
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

    messageComponentImpl = module.get<MessageComponent>('MessageComponent');
    httpService = module.get<MockHttpService>(HttpService);
    configService = module.get<MockConfigService>(ConfigService);
  });

  it('sendMessageTest', async () => {
    const channelId = 'moeasy-channelId';
    const testMessage = 'moeasy message';

    await messageComponentImpl.sendMessage(channelId, testMessage);

    expect(httpService.axiosRef.request).toHaveBeenCalledWith({
      method: 'post',
      baseURL: 'https://discord.com',
      url: `/api/v10/channels/${channelId}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${configService.get('discord.token')}`,
      },
      data: {
        content: testMessage,
        embeds: undefined,
      },
    });
  });

  it('getDMChannelTest', async () => {
    const recipientId = 'test-recipient-id';
    const result = await messageComponentImpl.getDMChannel(recipientId);

    expect(result).toEqual(httpService.channelResponse.data);
  });
});
