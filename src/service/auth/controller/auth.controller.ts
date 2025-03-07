import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@decorator/public.decorator';
import { AuthService } from '@service/auth/service/auth.service';
import { AuthCallbackResponse } from '@service/auth/dto/response/auth.callback.response';

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
  refreshAccessToken(@Body() refreshToken: string): string {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
