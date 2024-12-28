import type { Response } from 'express';
import type { AuthCallbackRequest } from '@service/auth/dto/request/auth.callback.request';

import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@decorator/public.decorator';
import { AuthService } from '@service/auth/service/auth.service';

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
  @Post('callback')
  async callback(@Body() req: AuthCallbackRequest, @Res() res: Response) {
    await this.authService.callback(req, res);
  }

  @Public()
  @Post('refresh')
  refreshAccessToken(@Body() refreshToken: string): string {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
