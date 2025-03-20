import { Body, Controller, Get, Inject, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ActivityCreateRequest } from '@service/activity/dto/request/activity.create.request';
import { ActivityService } from '@service/activity/service/activity.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';
import { ActivityListResponse } from '@service/activity/dto/response/activity.list.response';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ActivityUpdateRequest } from '@service/activity/dto/request/activity.update.request';
import { OrderingOptionEnum, OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ActivityStatusEnum, ActivityStatusEnumType } from '@enums/activity.status.enum';
import { ActivityResponse } from '@service/activity/dto/response/activity.response';
import { ActivityWithdrawRequest } from '@service/activity/dto/request/activity.withdraw.request';
import { ActivityDeleteRequest } from '@service/activity/dto/request/activity.delete.request';
import AuthGuard from '@root/middleware/auth/auth.guard';

@UseGuards(AuthGuard)
@ApiTags('activity')
@Controller('activity')
export class ActivityController {
  constructor(@Inject('ActivityService') private readonly activityService: ActivityService) {}

  @Post('create')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({ status: 200, description: 'Activity Entity has been created.' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    type: ActivityCreateRequest,
    description: 'info for creating a new activity.',
  })
  async createActivity(@Body() request: ActivityCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.activityService.createActivity(request, user.id);
  }

  @Post('update')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({ status: 200, description: 'Activity has been updated.' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_ACTIVITY })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data to modify activity.',
    type: ActivityUpdateRequest,
  })
  async updateActivity(@Body() request: ActivityUpdateRequest, @Token() user: AuthUser): Promise<void> {
    await this.activityService.updateActivity(request, user.id);
  }

  @Get('get')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({
    status: 200,
    description: 'activity entity retrieved successfully',
    type: ActivityResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: ErrorMessageType.NOT_FOUND_ACTIVITY,
  })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  async getActivity(@Query('activityId') activityId: number): Promise<ActivityResponse> {
    return this.activityService.getActivity(activityId);
  }

  @Get('get/list')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({
    status: 200,
    description: 'Activity list retrieved',
    type: ActivityListResponse,
  })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_ACTIVITY })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiQuery({
    name: 'status',
    isArray: true,
    enum: ActivityStatusEnum,
    description: 'activity status: in_progress, upcoming, completed.',
  })
  @ApiQuery({
    name: 'options',
    enum: OrderingOptionEnum,
    description: 'Option to sort activityList (LATEST for latest registered, NAME for alphabetical).',
  })
  @ApiQuery({
    name: 'meetingId',
    required: false,
  })
  async getActivityList(
    @Token() user: AuthUser,
    @Query('status') status: ActivityStatusEnumType[],
    @Query('options') options: OrderingOptionEnumType,
    @Query('meetingId') meetingId?: string,
  ): Promise<ActivityListResponse> {
    return this.activityService.getActivityList(user.id, status, options, meetingId);
  }

  @Post('withdraw')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({ status: 200, description: 'withdraw successfully' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_ACTIVITY })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBody({
    description: 'data to withdraw activity.',
    type: ActivityWithdrawRequest,
  })
  async withdraw(@Body() req: ActivityWithdrawRequest, @Token() user: AuthUser): Promise<void> {
    await this.activityService.withdraw(user.id, req);
  }

  @Post('delete')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiOkResponse({ status: 200, description: 'activity deleted successfully' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_ACTIVITY })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBody({
    description: 'data to delete activity',
    type: ActivityDeleteRequest,
  })
  async delete(@Body() req: ActivityDeleteRequest, @Token() user: AuthUser): Promise<void> {
    await this.activityService.delete(user.id, req);
  }
}
