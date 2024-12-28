import type { AuthCallbackRequest } from '@root/service/auth/dto/request/auth.callback.request';
import type { TokenDto } from '../dto/token.dto';
import type { DiscordAccessToken } from '../dto/discord.access.token';
import type { DiscordAuthorizedInfoResponse, DiscordUserByTokenDto } from '../dto/discord.authorized.info.response';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordComponent {
  private readonly baseURL: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseURL = this.configService.get('discord.host');
  }

  public async getTokens(req: AuthCallbackRequest): Promise<TokenDto> {
    const { data }: { data: DiscordAccessToken } = await this.httpService.axiosRef.request({
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
