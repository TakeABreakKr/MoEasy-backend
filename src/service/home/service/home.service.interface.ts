import { HomeResponse } from '@service/home/dto/response/home.response';
import { AuthUser } from '@decorator/token.decorator';
import { HomeCachedResponse } from '@service/home/dto/response/home.cached.response';

export interface HomeService {
  getHome(user: AuthUser): Promise<HomeResponse>;
  getCachedHome(): Promise<HomeCachedResponse>;
}
