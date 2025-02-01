import type { Response } from 'express';

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@decorator/public.decorator';

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
  async callback(@Query('code') code: string, @Res() res: Response) {
    await this.authService.callback(code, res);
  }

  @Public()
  @Post('refresh')
  refreshAccessToken(@Body() refreshToken: string): string {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
