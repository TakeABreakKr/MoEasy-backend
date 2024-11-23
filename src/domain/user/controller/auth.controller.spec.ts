import { AuthService } from '@domain/user/service/auth.service';
import { AuthController } from '@domain/user/controller/auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthCallbackRequest } from '@domain/user/dto/request/auth.callback.request';

class MockAuthService implements AuthService {
  private static readonly ACCESS_TOKEN_TTL = '5m' as const;
  private static readonly REFRESH_TOKEN_TTL = '1day' as const;

  private readonly ACCESS_TOKEN_SECRET_KEY: string;
  private readonly REFRESH_TOKEN_SECRET_KEY: string;

  public async callback() {}
  public refreshAccessToken(): string {
    return this.generateAccessToken();
  }
  public generateAccessToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MjczMjAwMCwiZXhwIjoxNjkyNzM1NjAwfQ.dHhEjsF1XWmQrL3XOEcR-8ZyyKoE9XGQ-Z91Tdcn50E';
  }
}

describe('AuthController', () => {
  let authcontroller: AuthController;

  beforeEach(() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AuthService', useClass: MockAuthService }],
    }).compile();
    authcontroller = module.get<AuthController>(AuthController);
  });

  it('loginTest', async () => {
    const result = await authcontroller.login();
    expect(result).toBe(void 0);
  });

  it('callbackTest', async () => {
    const req: AuthCallbackRequest = {
      code: 'ABC123DEF',
      state: 'active',
    };
    const res: Response = undefined;
    await authcontroller.callback(req, res); //아니 이거 어떻게 해
  });

  it('refreshTest', async () => {
    const refreshToken = 'ABC123DEF';
    const result = await authcontroller.refreshAccessToken(refreshToken); //아니 저기요
  });
});
