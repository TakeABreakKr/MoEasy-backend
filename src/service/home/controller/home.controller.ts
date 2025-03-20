import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { AuthUser, Token } from '@decorator/token.decorator';
import { HomeService } from '@service/home/service/home.service.interface';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { HomeCachedResponse } from '@service/home/dto/response/home.cached.response';
import { HeaderResponse } from '@service/home/dto/response/header.response';
import { Public } from '@decorator/public.decorator';
import AuthGuard from '@root/middleware/auth/auth.guard';
import { ApiCommonResponse } from '@decorator/api.common.response.decorator';

@UseGuards(AuthGuard)
@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(@Inject('HomeService') private readonly homeService: HomeService) {}

  @Public()
  @Get('')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiExtraModels(HomeResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(HomeResponse) })
  async getHome(@Token() user: AuthUser): Promise<HomeResponse> {
    return this.homeService.getHome(user);
  }

  @Public()
  @Get('/cache')
  @ApiExtraModels(HomeCachedResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(HomeCachedResponse) })
  async getCachedHome(): Promise<HomeCachedResponse> {
    return this.homeService.getCachedHome();
  }

  @Get('header')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiExtraModels(HeaderResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(HeaderResponse) })
  async getHeader(@Token() user: AuthUser): Promise<HeaderResponse> {
    return this.homeService.getHeader(user);
  }
}
