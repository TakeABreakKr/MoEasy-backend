import { AuthService } from '@domain/user/service/auth.service';
import { AuthController } from '@domain/user/controller/auth.controller';
import { Test, TestingModule } from '@nestjs/testing';

class MockAuthService implements AuthService {
  async login() {}

  async callback() {}
}

describe('AuthController', () => {
  let authController: AuthController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: 'AuthService', useClass: MockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('loginTest', async () => {
    const result = await authController.login();
    expect(result).toBe(void 0);
  });

  it('callbackTest', async () => {});
  it('refreshTest', async () => {});
});
