import type { AuthCallbackRequest } from '@domain/user/dto/request/auth.callback.request';
import type { TokenDto } from '@domain/user/dto/token.dto';
import type { DiscordAccessTokenResponse } from '../dto/response/discord.access.token.response';
import type {
  DiscordAuthorizedInfoResponse,
  DiscordUserByTokenDto,
} from '../dto/response/discord.authorized.info.response';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserComponent {
  private readonly baseURL: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseURL = this.configService.get('discord.host');
  }

  public async getTokens(req: AuthCallbackRequest): Promise<TokenDto> {
    const { data }: { data: DiscordAccessTokenResponse } = await this.httpService.axiosRef.request({
      method: 'post',
      baseURL: this.baseURL,
      url: '/api/v10/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        grant_type: 'authorization_code',
        code: req.code,
      },
    });
    return {
      accessToken: data.token_type + ' ' + data.access_token,
      refreshToken: data.token_type + ' ' + data.refresh_token,
    };
  }

  public async getUser(token: TokenDto): Promise<DiscordUserByTokenDto> {
    const { data }: { data: DiscordAuthorizedInfoResponse } = await this.httpService.axiosRef.request({
      method: 'get',
      baseURL: this.baseURL,
      url: '/oauth2/@me',
      headers: {
        authorization: `Bearer ${token.accessToken}`,
      },
    });

    return data.user;
  }
}
