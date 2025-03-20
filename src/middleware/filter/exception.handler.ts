import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { Response } from 'express';
import { CommonResponse } from '@root/middleware/common.response';

@Catch(HttpException)
export class ExceptionHandler implements ExceptionFilter {
  private logger = new Logger('ExceptionHandler');

  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    if (typeof message !== 'string') {
      response.status(status).json(new CommonResponse(status, message['message'] || '알 수 없는 오류가 발생했습니다.'));
    } else {
      response.status(status).json(new CommonResponse(status, message));
    }

    this.logger.error(`Exception: ${message} (${status})`);
  }
}
