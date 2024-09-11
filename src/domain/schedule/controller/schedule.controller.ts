import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';
import { ScheduleListResponse } from '@domain/schedule/dto/response/schedule.list.response';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ScheduleUpdateRequest } from '@domain/schedule/dto/request/schedule.update.request';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(@Inject('ScheduleService') private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Schedule Entity has been created.' })
  @ApiConsumes('application/json')
  async createSchedule(@Body() request: ScheduleCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.scheduleService.createSchedule(request, user.id);
  }

  @Post('update')
  @ApiOkResponse({ status: 200, description: 'Schedule has been updated.' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_SCHEDULE })
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'values to modify schedule.',
    type: ScheduleUpdateRequest,
  })
  async updateSchedule(@Body() request: ScheduleUpdateRequest): Promise<void> {
    await this.scheduleService.updateSchedule(request);
  }

  @Get('get/list')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Schedule list retrieved',
    type: ScheduleListResponse,
  })
  @ApiBody({ description: 'Filter schedules by options.' })
  async getScheduleList(@Query('meetingId') meetingId: string, @Token() user: AuthUser): Promise<ScheduleListResponse>{
    return this.scheduleService.getScheduleList(meetingId, user.id);
  }
}
