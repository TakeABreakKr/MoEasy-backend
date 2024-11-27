import { AuthController } from '../controller/auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthCallbackRequest } from '../dto/request/auth.callback.request';
import { AuthService } from '../service/auth.service';

class MockAuthService {
  public async login() {}
  public async callback(): Promise<void> {}
  public refreshAccessToken(): string {
    return this.generateAccessToken();
  }
  private async getUser() {}
  private async createTokens() {}

  private generateAccessToken(): string {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MjczMjAwMCwiZXhwIjoxNjkyNzM1NjAwfQ.dHhEjsF1XWmQrL3XOEcR-8ZyyKoE9XGQ-Z91Tdcn50E';
  }
  private generateRefreshToken() {}
}

describe('AuthController', () => {
  let authcontroller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
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
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authcontroller.callback(req, res);
  });

  it('refreshTest', async () => {
    const refreshToken = 'ABC123DEF';
    const jwt: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MjczMjAwMCwiZXhwIjoxNjkyNzM1NjAwfQ.dHhEjsF1XWmQrL3XOEcR-8ZyyKoE9XGQ-Z91Tdcn50E';

    const result = authcontroller.refreshAccessToken(refreshToken);
    expect(result).toBe(jwt);
  });
});
