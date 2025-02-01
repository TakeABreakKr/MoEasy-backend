import type { DiscordAccessTokenResponse } from '../dto/response/discord.access.token.response';
import type { DiscordUserByTokenDto } from '../dto/response/discord.authorized.info.response';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { TokenDto } from '@domain/user/dto/token.dto';

@Injectable()
export class DiscordComponent {
  private readonly baseURL: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseURL = this.configService.get('discord.host');
  }

  public async getTokens(code: string): Promise<TokenDto> {
    const { data }: { data: DiscordAccessTokenResponse } = await this.httpService.axiosRef.request({
      method: 'post',
      baseURL: this.baseURL,
      url: '/api/v10/oauth2/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: new URLSearchParams({
        client_id: this.configService.get('discord.client_id'),
        client_secret: this.configService.get('discord.client_secret'),
        code,
        redirect_uri: this.configService.get('host') + '/auth/callback',
        grant_type: 'authorization_code',
      }),
    });

    return {
      accessToken: data.token_type + ' ' + data.access_token,
      refreshToken: data.token_type + ' ' + data.refresh_token,
    };
  }

  public async getUser(token: TokenDto): Promise<DiscordUserByTokenDto> {
    const { data } = await this.httpService.axiosRef.request<DiscordUserByTokenDto>({
      method: 'get',
      baseURL: this.baseURL,
      url: '/api/v10/users/@me',
      headers: {
        Authorization: token.accessToken,
      },
    });

    return data;
  }
}
