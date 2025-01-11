import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthUser, Token } from '@decorator/token.decorator';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { HomeService } from '@service/home/service/home.service.interface';

@ApiTags('home')
@Controller('home')
export class HomeController {
  constructor(@Inject('HomeService') private readonly homeService: HomeService) {}

  @Get('')
  @ApiOkResponse({ status: 200, type: HomeResponse, description: 'get home data successfully' })
  async getHome(@Token() user: AuthUser): Promise<HomeResponse> {
    return this.homeService.getHome(user);
  }
}
