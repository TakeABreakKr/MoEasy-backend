import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '@decorator/public.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export default class AuthGuard implements CanActivate {
  public static readonly ACCESS_TOKEN_HEADER = 'access-token';
  private readonly ACCESS_TOKEN_SECRET_KEY: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    this.ACCESS_TOKEN_SECRET_KEY = this.configService.get('auth.ACCESS_TOKEN_SECRET_KEY');
  }

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.headers[AuthGuard.ACCESS_TOKEN_HEADER];
    if (accessToken) {
      request.user = this.validateToken(accessToken);
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    if (accessToken === undefined) {
      throw new HttpException(ErrorMessageType.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  public validateToken(token: string): { id: string } {
    try {
      return this.jwtService.verify(token, { secret: this.ACCESS_TOKEN_SECRET_KEY });
    } catch (error) {
      switch (error.message) {
        case 'INVALID_TOKEN':
        case 'TOKEN_IS_ARRAY':
        case 'NO_USER':
          throw new HttpException(ErrorMessageType.NO_USER, HttpStatus.UNAUTHORIZED);

        case 'EXPIRED_TOKEN':
          throw new HttpException(ErrorMessageType.EXPIRED_TOKEN, HttpStatus.GONE);

        default:
          throw new HttpException(ErrorMessageType.SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
