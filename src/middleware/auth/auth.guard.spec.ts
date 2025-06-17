import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import AuthGuard from './auth.guard';
import { HttpStatus, Type } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { IS_PUBLIC_KEY } from '@decorator/public.decorator';

const TEST_CONFIG = {
  'auth.ACCESS_TOKEN_SECRET_KEY': 'test-secret-key',
};
class MockConfigService extends ConfigService {
  get(key: string) {
    return TEST_CONFIG[key];
  }
}

class MockJwtService {
  verify = jest.fn((token) => {
    if (token === 'valid-token') {
      return { id: 'test-user-id' };
    }
    if (token === 'expired-token') {
      throw new Error('EXPIRED_TOKEN');
    }
    if (token === 'no-user-token') {
      throw new Error('NO_USER');
    }
    throw new Error('UNKNOWN_ERROR');
  });
}

type Handler = {
  [IS_PUBLIC_KEY]?: boolean;
};

class MockReflactor extends Reflector {
  getAllAndOverride(handlers: Type<Handler>[]): boolean {
    return handlers[0][IS_PUBLIC_KEY];
  }
}

const createMockContext = (headers?: { access_token?: string }) => ({
  getHandler: jest.fn(),
  getClass: jest.fn(),
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: headers || {},
    }),
  }),
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getType: jest.fn(),
});

describe('AuthGuard', () => {
  let authGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        { provide: ConfigService, useClass: MockConfigService },
        { provide: JwtService, useClass: MockJwtService },
        { provide: Reflector, useClass: MockReflactor },
      ],
    }).compile();

    authGuard = module.get<AuthGuard>(AuthGuard);
  });

  describe('canActivateTest', () => {
    it('isPublic true', () => {
      const mockContext = createMockContext({ access_token: 'valid-token' });
      mockContext.getHandler = jest.fn().mockReturnValue({ [IS_PUBLIC_KEY]: true });
      const result = authGuard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('validateToken allows access', () => {
      const mockContext = createMockContext({ access_token: 'valid-token' });
      const result = authGuard.canActivate(mockContext);

      expect(result).toBe(true);
    });

    it('empty_token - Error', () => {
      const mockContext = createMockContext();

      const throwExpectation = () => authGuard.canActivate(mockContext);

      expect(throwExpectation).toThrow(
        expect.objectContaining({
          message: ErrorMessageType.INVALID_TOKEN,
          status: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('expired_token - Error', () => {
      const mockContext = createMockContext({ access_token: 'expired-token' });
      const throwExpectation = () => authGuard.canActivate(mockContext);

      expect(throwExpectation).toThrow(
        expect.objectContaining({
          message: ErrorMessageType.EXPIRED_TOKEN,
          status: HttpStatus.GONE,
        }),
      );
    });

    it('no_user - Error', () => {
      const mockContext = createMockContext({ access_token: 'no-user-token' });
      const throwExpectation = () => authGuard.canActivate(mockContext);

      expect(throwExpectation).toThrow(
        expect.objectContaining({
          message: ErrorMessageType.NO_USER,
          status: HttpStatus.UNAUTHORIZED,
        }),
      );
    });

    it('default - Error', () => {
      const mockContext = createMockContext({ access_token: 'unknown-error-token' });
      const throwExpectation = () => authGuard.canActivate(mockContext);

      expect(throwExpectation).toThrow(
        expect.objectContaining({
          message: ErrorMessageType.SERVER_ERROR,
          status: HttpStatus.INTERNAL_SERVER_ERROR,
        }),
      );
    });
  });
});
