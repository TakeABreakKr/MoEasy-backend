import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from '@decorator/public.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export default class AuthGuard implements CanActivate {
  private readonly ACCESS_TOKEN_SECRET_KEY: string;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {
    this.ACCESS_TOKEN_SECRET_KEY = this.configService.get('auth.ACCESS_TOKEN_SECRET_KEY');
  }

  public canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { access_token } = request.headers;
    if (access_token === undefined) {
      throw new HttpException(ErrorMessageType.INVALID_TOKEN, HttpStatus.UNAUTHORIZED);
    }

    request.user = this.validateToken(access_token);
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
