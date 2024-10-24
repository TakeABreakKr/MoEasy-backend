import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';
import { OrderingOptionEnum, OrderingOptionEnumType } from '@enums/ordering.option.enum';
import { ScheduleStatusEnum, ScheduleStatusEnumType } from '@enums/schedule.status.enum';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(@Inject('ScheduleService') private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Schedule Entity has been created.' })
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
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data to modify schedule.',
    type: ScheduleUpdateRequest,
  })
  async updateSchedule(@Body() request: ScheduleUpdateRequest, @Token() user: AuthUser): Promise<void> {
    await this.scheduleService.updateSchedule(request, user.id);
  }

  @Get('get/list')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Schedule list retrieved',
    type: ScheduleListResponse,
  })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
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
    @Query('meetingId') meetingId: string,
    @Query('status') status: ScheduleStatusEnumType[],
    @Query('options') options: OrderingOptionEnumType,
    @Token() user: AuthUser,
  ): Promise<ScheduleListResponse> {
    return this.scheduleService.getScheduleList(user.id, meetingId, status, options);
  }
}
