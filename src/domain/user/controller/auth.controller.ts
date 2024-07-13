import type { Response } from 'express';
import type { AuthService } from '../service/auth.service';
import type { AuthCallbackRequest } from '../dto/request/auth.callback.request';

import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login() {
    await this.authService.login();
  }

  @Post('callback')
  async callback(@Body() req: AuthCallbackRequest, @Res() res: Response) {
    await this.authService.callback(req, res);
  }
}
