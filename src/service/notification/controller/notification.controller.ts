import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { NotificationService } from '@service/notification/service/notification.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';
import { NotificationResponse } from '@service/notification/dto/response/notification.response';
import { NotificationCheckRequest } from '@service/notification/dto/request/notification.check.request';
import AuthGuard from '@root/middleware/auth/auth.guard';
import { ApiCommonResponse } from '@decorator/api.common.response.decorator';

@UseGuards(AuthGuard)
@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(@Inject('NotificationService') private notificationService: NotificationService) {}

  @Get()
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiExtraModels(NotificationResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(NotificationResponse) })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiForbiddenResponse({ status: 403, description: ErrorMessageType.FORBIDDEN_INVITE_REQUEST })
  async getNotifications(@Token() user: AuthUser): Promise<NotificationResponse> {
    return this.notificationService.getNotifications(user.id);
  }

  // 여러개 체크 되도록
  @Post('check')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiForbiddenResponse({ status: 403, description: ErrorMessageType.FORBIDDEN_INVITE_REQUEST })
  async checkNotification(@Body() req: NotificationCheckRequest, @Token() user: AuthUser) {
    await this.notificationService.checkNotifications(req, user.id);
  }
}
