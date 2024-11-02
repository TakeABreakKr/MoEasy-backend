import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags, ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';
import { OrderingOptionEnum, OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleStatusEnum, ScheduleStatusEnumType } from '@enums/schedule.status.enum';
import { ScheduleResponse } from '@domain/schedule/dto/response/schedule.response';
import { ScheduleWithdrawRequest } from '@domain/schedule/dto/request/schedule.withdraw.request';
import { ScheduleDeleteRequest } from '@domain/schedule/dto/request/schedule.delete.request';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(@Inject('ScheduleService') private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Schedule Entity has been created.' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    type: ScheduleCreateRequest,
    description: 'info for creating a new schedule.',
  })
  async createSchedule(@Body() request: ScheduleCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.scheduleService.createSchedule(request, user.id);
  }

  @Post('update')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Schedule has been updated.' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data to modify schedule.',
    type: ScheduleUpdateRequest,
  })
  async updateSchedule(@Body() request: ScheduleUpdateRequest, @Token() user: AuthUser): Promise<void> {
    await this.scheduleService.updateSchedule(request, user.id);
  }

  @Get('get')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'schedule entity retrieved successfully',
    type: ScheduleResponse,
  })
  @ApiBadRequestResponse({
    status: 400,
    description: ErrorMessageType.NOT_FOUND_SCHEDULE,
  })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  async getSchedule(@Query('scheduleId') scheduleId: number): Promise<ScheduleResponse> {
    return this.scheduleService.getSchedule(scheduleId);
  }

  @Get('get/list')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Schedule list retrieved',
    type: ScheduleListResponse,
  })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiQuery({
    name: 'status',
    isArray: true,
    enum: ScheduleStatusEnum,
    description: 'schedule status: in_progress, upcoming, completed.',
  })
  @ApiQuery({
    name: 'options',
    enum: OrderingOptionEnum,
    description: 'Option to sort scheduleList (LATEST for latest registered, NAME for alphabetical).',
  })
  async getScheduleList(
    @Token() user: AuthUser,
    @Query('status') status: ScheduleStatusEnumType[],
    @Query('options') options: OrderingOptionEnumType,
    @Query('meetingId') meetingId?: string,
  ): Promise<ScheduleListResponse> {
    return this.scheduleService.getScheduleList(user.id, status, options, meetingId);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw successfully' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBody({
    description: 'data to withdraw schedule.',
    type: ScheduleWithdrawRequest,
  })
  async withdraw(@Body() req: ScheduleWithdrawRequest, @Token() user: AuthUser): Promise<void> {
    await this.scheduleService.withdraw(user.id, req);
  }

  @Post('delete')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'schedule deleted successfully' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBody({
    description: 'data to delete schedule',
    type: ScheduleDeleteRequest,
  })
  async delete(@Body() req: ScheduleDeleteRequest, @Token() user: AuthUser): Promise<void> {
    await this.scheduleService.delete(user.id, req);
  }
}
