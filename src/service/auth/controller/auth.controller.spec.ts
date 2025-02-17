import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@service/auth/service/auth.service';

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
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useClass: MockAuthService }],
    }).compile();
    authController = module.get<AuthController>(AuthController);
  });

  it('loginTest', async () => {
    const result = await authController.login();
    expect(result).toBe(void 0);
  });

  it('callbackTest', async () => {
    const code: string = 'ABC123DEF';
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await authController.callback(code, res);
  });

  it('refreshTest', async () => {
    const refreshToken = 'ABC123DEF';
    const jwt: string =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIzLCJ1c2VybmFtZSI6ImpvaG5fZG9lIiwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5MjczMjAwMCwiZXhwIjoxNjkyNzM1NjAwfQ.dHhEjsF1XWmQrL3XOEcR-8ZyyKoE9XGQ-Z91Tdcn50E';

    const result = authController.refreshAccessToken(refreshToken);
    expect(result).toBe(jwt);
  });
});
