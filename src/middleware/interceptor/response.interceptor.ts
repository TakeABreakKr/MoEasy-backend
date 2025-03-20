import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from '@root/middleware/common.response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode || HttpStatus.OK;
    const message = response.message || 'success';
    return next.handle().pipe(
      map((data) => {
        return new CommonResponse(statusCode, message, data);
      }),
    );
  }
}
