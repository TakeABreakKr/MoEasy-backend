import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonResponse } from '@root/middleware/common.response';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((data) => {
        return new CommonResponse(HttpStatus.OK, 'success', data);
      }),
    );
  }
}
