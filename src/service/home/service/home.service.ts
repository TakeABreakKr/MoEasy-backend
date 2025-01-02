import { Injectable } from '@nestjs/common';
import { HomeService } from '@service/home/service/home.service.interface';
import { HomeResponse } from '@service/home/dto/response/home.response';
import { AuthUser } from '@decorator/token.decorator';

@Injectable()
export class HomeServiceImpl implements HomeService {
  constructor() {}

  public async getHome(user: AuthUser): Promise<HomeResponse> {
    if (!user || !user.id) {
      return this.getLoggedOutHome();
    }

    return this.getLoggedInHome(user.id);
  }

  private async getLoggedOutHome(): Promise<HomeResponse> {
    return null;
  }

  private async getLoggedInHome(id: number): Promise<HomeResponse> {
    return null;
  }
}
