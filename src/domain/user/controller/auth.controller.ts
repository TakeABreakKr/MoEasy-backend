import type { Response } from 'express';

import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@decorator/public.decorator';
import { AuthCallbackRequest } from '@domain/user/dto/request/auth.callback.request';

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
  @Get('callback')
  async callback(@Query() { code }: AuthCallbackRequest, @Res() res: Response) {
    await this.authService.callback(code, res);
  }

  @Public()
  @Post('refresh')
  refreshAccessToken(@Body() refreshToken: string): string {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
