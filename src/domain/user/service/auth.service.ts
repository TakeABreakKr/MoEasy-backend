import type { Response } from 'express';
import type { Users } from '../entity/users.entity';
import type { DiscordProfileDto } from '../dto/discord.profile.dto';
import type { AuthCallbackRequest } from '../dto/request/auth.callback.request';
import type { TokenDto } from '../dto/token.dto';
import type { DiscordUserByTokenDto } from '../dto/response/discord.authorized.info.response';

import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DiscordComponent } from '../component/discord.component';
import { UsersDao } from '../dao/users.dao';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthUser } from '@decorator/token.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export class AuthService {
  private static readonly ACCESS_TOKEN_TTL = '5m' as const;
  private static readonly REFRESH_TOKEN_TTL = '1day' as const;

  private readonly ACCESS_TOKEN_SECRET_KEY: string;
  private readonly REFRESH_TOKEN_SECRET_KEY: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private discordComponent: DiscordComponent,
    private usersDao: UsersDao,
  ) {
    this.ACCESS_TOKEN_SECRET_KEY = this.configService.get('auth.ACCESS_TOKEN_SECRET_KEY');
    this.REFRESH_TOKEN_SECRET_KEY = this.configService.get('auth.REFRESH_TOKEN_SECRET_KEY');
  }

  public async login() {
    throw new Error('not presented yet!!');
  }

  public async callback(req: AuthCallbackRequest, res: Response) {
    const { accessToken: discordAccessToken, refreshToken: discordRefreshToken }: TokenDto =
      await this.discordComponent.getTokens(req);

    const discordUser: DiscordUserByTokenDto = await this.discordComponent.getUser({
      accessToken: discordAccessToken,
      refreshToken: discordRefreshToken,
    });
    const profile: DiscordProfileDto = {
      id: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
      email: discordUser.email,
    };
    const user = await this.getUser(profile);
    const { accessToken, refreshToken }: TokenDto = this.createTokens(user);

    const host = this.configService.get('frontend.host');
    res.set('AccessToken', accessToken);
    res.set('RefreshToken', refreshToken);
    return res.redirect(`${host}`);
  }

  public refreshAccessToken(refreshToken: string): string {
    let user: AuthUser;
    try {
      user = this.jwtService.verify(refreshToken, { secret: this.REFRESH_TOKEN_SECRET_KEY });
    } catch (e) {
      throw new UnauthorizedException(ErrorMessageType.INVALID_TOKEN);
    }

    return this.generateAccessToken(user);
  }

  private async getUser(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = await this.usersDao.findByDiscordId(profile.id);
    if (user) {
      return user;
    }

    return this.usersDao.createUsers(profile);
  }

  private createTokens(user: Users): TokenDto {
    const payload: AuthUser = {
      id: user.users_id,
      name: user.username,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(user: AuthUser) {
    return this.jwtService.sign(user, {
      secret: this.ACCESS_TOKEN_SECRET_KEY,
      expiresIn: AuthService.ACCESS_TOKEN_TTL,
    });
  }

  private generateRefreshToken(user: AuthUser) {
    return this.jwtService.sign(user, {
      secret: this.REFRESH_TOKEN_SECRET_KEY,
      expiresIn: AuthService.REFRESH_TOKEN_TTL,
    });
  }
}
