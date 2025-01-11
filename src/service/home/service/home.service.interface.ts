import { HomeResponse } from '@service/home/dto/response/home.response';
import { AuthUser } from '@decorator/token.decorator';

export interface HomeService {
  getHome(user: AuthUser): Promise<HomeResponse>;
}
