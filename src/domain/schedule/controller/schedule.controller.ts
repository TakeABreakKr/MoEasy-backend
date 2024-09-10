import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ScheduleCreateRequest } from '@domain/schedule/dto/request/schedule.create.request';
import { ScheduleService } from '@domain/schedule/service/schedule.service.interface';
import { AuthUser, Token } from '@decorator/token.decorator';

@ApiTags('schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(@Inject('ScheduleService') private readonly scheduleService: ScheduleService) {}

  @Post('create')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Schedule Entity has been created.' })
  async createSchedule(@Body() request: ScheduleCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.scheduleService.createSchedule(request, user.id);
  }
}
