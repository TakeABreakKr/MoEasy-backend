import type { HttpService } from '@nestjs/axios';
import type { AuthCallbackRequest } from '../dto/request/auth.callback.request';
import type { TokenDto } from '../dto/token.dto';
import type { DiscordAccessTokenResponse } from '../dto/response/discord.access.token.response';
import type {
  DiscordAuthorizedInfoResponse,
  DiscordUserByTokenDto,
} from '../dto/response/discord.authorized.info.response';

import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscordComponent {
  private baseURL = 'https://discord.com';
  constructor(private httpService: HttpService) {}

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
      url: '',
      headers: {
      },
    });

    return data.user;
  }
}
