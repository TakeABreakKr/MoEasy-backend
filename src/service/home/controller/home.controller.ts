import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, Token } from '@decorator/token.decorator';
import { HomeService } from '@service/home/service/home.service.interface';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { HomeCachedResponse } from '@service/home/dto/response/home.cached.response';
import { HeaderResponse } from '@service/home/dto/response/header.response';
import { Public } from '@decorator/public.decorator';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(@Inject('HomeService') private readonly homeService: HomeService) {}

  @Public()
  @Get('')
  @ApiOkResponse({ status: 200, type: HomeResponse, description: 'get home data successfully' })
  async getHome(@Token() user: AuthUser): Promise<HomeResponse> {
    return this.homeService.getHome(user);
  }

  @Public()
  @Get('/cache')
  @ApiOkResponse({ status: 200, type: HomeCachedResponse, description: 'get home data successfully' })
  async getCachedHome(): Promise<HomeCachedResponse> {
    return this.homeService.getCachedHome();
  }

  @Get('header')
  @ApiOkResponse({ status: 200, type: HeaderResponse, description: 'get header data successfully' })
  async getHeader(@Token() user: AuthUser): Promise<HeaderResponse> {
    return this.homeService.getHeader(user);
  }
}
