import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, Token } from '@decorator/token.decorator';
import { HomeService } from '@service/home/service/home.service.interface';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { HomeCachedResponse } from '@service/home/dto/response/home.cached.response';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(@Inject('HomeService') private readonly homeService: HomeService) {}

  @Get('')
  @ApiOkResponse({ status: 200, type: HomeResponse, description: 'get home data successfully' })
  async getHome(@Token() user: AuthUser): Promise<HomeResponse> {
    return this.homeService.getHome(user);
  }

  @Get('/cache')
  @ApiOkResponse({ status: 200, type: HomeCachedResponse, description: 'get home data successfully' })
  async getCachedHome(): Promise<HomeCachedResponse> {
    return this.homeService.getCachedHome();
  }
}
