import type { Response } from 'express';
import type { ConfigService } from '@nestjs/config';
import type { UsersDao } from '../dao/users.dao';
import type { Users } from '../entity/users.entity';
import type { DiscordProfileDto } from '../dto/discord.profile.dto';
import type { AuthCallbackRequest } from '../dto/request/auth.callback.request';
import type { DiscordComponent } from '../component/discord.component';
import type { TokenDto } from '../dto/token.dto';
import type { DiscordUserByTokenDto } from '../dto/response/discord.authorized.info.response';

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private discordComponent: DiscordComponent,
    private usersDao: UsersDao,
  ) {}

  public async login() {
    throw new Error('not presented yet!!');
  }

  public async callback(req: AuthCallbackRequest, res: Response) {
    const { accessToken, refreshToken }: TokenDto = await this.discordComponent.getTokens(req);

    const discordUser: DiscordUserByTokenDto = await this.discordComponent.getUser({ accessToken, refreshToken });
    const profile: DiscordProfileDto = {
      id: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
      email: discordUser.email,
    };

    await this.getUser(profile);

    const host = this.configService.get('frontend.host');
    res.set('AccessToken', accessToken);
    res.set('RefreshToken', refreshToken);
    return res.redirect(`${host}`);
  }

  private async getUser(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = await this.usersDao.findByDiscordId(profile.id);
    if (user) {
      return user;
    }

    return this.usersDao.createUsers(profile);
  }
}
