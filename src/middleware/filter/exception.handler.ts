import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CommonResponse } from '@root/middleware/common.response';

@Catch(HttpException)
export class ExceptionHandler implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    if (typeof message !== 'string') {
      response.status(status).json(new CommonResponse(status, message['message']));
    } else {
      response.status(status).json(new CommonResponse(status, message));
    }
  }
}
