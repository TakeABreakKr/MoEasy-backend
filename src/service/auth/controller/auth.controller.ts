import AuthGuard from '@root/middleware/auth/auth.guard';
import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Public } from '@decorator/public.decorator';
import { AuthService } from '@service/auth/service/auth.service';
import { AuthCallbackResponse } from '@service/auth/dto/response/auth.callback.response';
import { RefreshTokenResponse } from '@service/auth/dto/response/refresh.token.response';
import { RefreshTokenRequest } from '@service/auth/dto/request/refresh.token.request';

@UseGuards(AuthGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  async login() {
    await this.authService.login();
  }

  @Public()
  @Get('login/url')
  getLoginUrl(): string {
    return this.authService.getLoginUrl();
  }

  @Public()
  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: AuthCallbackResponse) {
    await this.authService.callback(code, res);
  }

  @Public()
  @Post('refresh')
  @ApiBody({ type: RefreshTokenRequest })
  @ApiOkResponse({ status: 200, description: 'refresh token succeed', type: RefreshTokenResponse })
  @ApiUnauthorizedResponse({ status: 401, description: 'invalid refresh token' })
  async refreshAccessToken(@Body() refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    return this.authService.refreshAccessToken(refreshTokenRequest.refreshToken);
  }
}
