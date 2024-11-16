import type { Response } from 'express';
import type { AuthCallbackRequest } from '../dto/request/auth.callback.request';

import { Body, Controller, Get, Post, Res } from '@nestjs/common';
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
  @Get('callback')
  async callback(@Body() req: AuthCallbackRequest, @Res() res: Response) {
    await this.authService.callback(req, res);
  }

  @Public()
  @Post('refresh')
  refreshAccessToken(@Body() refreshToken: string): string {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
