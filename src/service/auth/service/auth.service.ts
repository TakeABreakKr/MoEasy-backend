import type { Users } from '@domain/user/entity/users.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { DiscordComponent } from '@domain/discord/component/discord.component.interface';
import { AuthUser } from '@decorator/token.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';
import { DiscordUtil } from '@utils/discord.util';
import { DiscordUserByTokenDto } from '@domain/discord/dto/response/discord.authorized.info.response';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { TokenDto } from '@service/auth/dto/token.dto';
import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';
import { AuthCallbackResponse } from '@service/auth/dto/response/auth.callback.response';
import { RefreshTokenResponse } from '@service/auth/dto/response/refresh.token.response';
import { FileService } from '@file/service/file.service';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';
import { DiscordUserProfileDto } from '@domain/user/dto/discord.profile.dto';

@Injectable()
export class AuthService {
  private static readonly ACCESS_TOKEN_TTL = '5m' as const;
  private static readonly REFRESH_TOKEN_TTL = '1day' as const;

  private readonly ACCESS_TOKEN_SECRET_KEY: string;
  private readonly REFRESH_TOKEN_SECRET_KEY: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject('DiscordComponent') private discordComponent: DiscordComponent,
    @Inject('UsersComponent') private usersComponent: UsersComponent,
    @Inject('FileService') private fileService: FileService,
  ) {
    this.ACCESS_TOKEN_SECRET_KEY = this.configService.get('auth.ACCESS_TOKEN_SECRET_KEY');
    this.REFRESH_TOKEN_SECRET_KEY = this.configService.get('auth.REFRESH_TOKEN_SECRET_KEY');
  }

  public async login() {
    throw new Error('not presented yet!!');
  }

  public getLoginUrl(): string {
    const clientId: string = this.configService.get('discord.client_id');
    const redirectUri: string = this.configService.get('host') + '/auth/callback';
    return DiscordUtil.getSignInUrl(clientId, redirectUri);
  }

  public async callback(code: string, res: AuthCallbackResponse) {
    if (!code || typeof code !== 'string') {
      throw new BadRequestException(ErrorMessageType.DISCORD_AUTH_CODE_ERROR);
    }

    let discordTokens: TokenDto;

    try {
      discordTokens = await this.discordComponent.getTokens(code);
    } catch (error) {
      throw new UnauthorizedException(ErrorMessageType.TOKEN_ISSUANCE_FAILED);
    }

    const discordUser: DiscordUserByTokenDto = await this.discordComponent.getUser({
      accessToken: discordTokens.accessToken,
      refreshToken: discordTokens.refreshToken,
    });

    const profile: DiscordUserProfileDto = {
      id: discordUser.id,
      username: discordUser.username,
      avatar: discordUser.avatar,
      email: discordUser.email,
      discriminator: discordUser.discriminator,
    };
    const user = await this.getUser(profile);
    const { accessToken, refreshToken }: TokenDto = this.createTokens(user);

    const host = this.configService.get('frontend.host');
    res.cookie('AccessToken', accessToken);
    res.cookie('RefreshToken', refreshToken);
    return res.redirect(`${host}`);
  }

  public async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    let authUser: AuthUser;
    try {
      authUser = this.jwtService.verify(refreshToken, { secret: this.REFRESH_TOKEN_SECRET_KEY });
    } catch (e) {
      throw new UnauthorizedException(ErrorMessageType.INVALID_TOKEN);
    }

    if (!authUser?.id) {
      throw new BadRequestException(ErrorMessageType.INVALID_TOKEN);
    }

    const user = await this.usersComponent.findById(authUser.id);
    return this.createTokens(user);
  }

  private async getUser(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = await this.usersComponent.findByDiscordId(profile.id);
    if (user) {
      return user;
    }

    let profileImageId: number;
    let profileImagePath: string;

    try {
      const defaultImageUrl = `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator, 10) % 5}.png`;
      if (profile.avatar) {
        const discordAvatarUrl =
          this.configService.get<string>('discord.cdnHost') + 'avatars/' + profile.id + '/' + profile.avatar;
        const { id, path } = await this.fileService.uploadFromUrl(discordAvatarUrl);
        profileImageId = id;
        profileImagePath = path;
      } else {
        const { id, path } = await this.fileService.uploadFromUrl(defaultImageUrl);
        profileImageId = id;
        profileImagePath = path;
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessageType.DISCORD_PROFILE_IMAGE_UPLOAD_FAILED);
    }

    const userProfile: UsersCreateDto = {
      discordId: profile.id,
      username: profile.username,
      email: profile.email,
      profileImageId: profileImageId,
      profileImagePath: profileImagePath,
      explanation: '',
      settings: {
        allowNotificationYn: false,
      },
    };

    return this.usersComponent.createUsers(userProfile);
  }

  private createTokens(user: Users): TokenDto {
    const payload: AuthUser = {
      id: user.id,
      name: user.username,
      issueDate: Date.now(),
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
