import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeetingCreateRequest } from '../dto/request/meeting.create.request';
import { MeetingUpdateRequest } from '../dto/request/meeting.update.request';
import { MeetingResponse } from '../dto/response/meeting.response';
import { MeetingListResponse } from '../dto/response/meeting.list.response';
import { MeetingThumbnailUpdateRequest } from '../dto/request/meeting.thumbnail.update.request';
import { AuthorityEnumType } from '@enums/authority.enum';
import { MeetingService } from '@domain/meeting/service/meeting.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { Public } from '@decorator/public.decorator';
import { AuthUser, Token } from '@decorator/token.decorator';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(@Inject('MeetingService') private readonly meetingService: MeetingService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully created.' })
  @ApiConsumes('multipart/form-data')
  async createMeeting(@Body() request: MeetingCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.meetingService.createMeeting(request, user.id);
  }

  @Post('update')
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Basic values to modify meetings',
    type: MeetingUpdateRequest,
  })
  async updateMeeting(@Body() request: MeetingUpdateRequest): Promise<void> {
    await this.meetingService.updateMeeting(request);
  }

  @Post('update/thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  async updateMeetingThumbnail(@Body() request: MeetingThumbnailUpdateRequest): Promise<void> {
    await this.meetingService.updateMeetingThumbnail(request);
  }

  @Get('get')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting retrieved successfully',
    type: MeetingResponse,
  })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiQuery({
    name: 'meetingId',
  })
  async getMeeting(@Query('meetingId') meetingId: string): Promise<MeetingResponse> {
    return this.meetingService.getMeeting(meetingId);
  }

  @Get('get/list')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully',
    type: MeetingListResponse,
  })
  @ApiBearerAuth()
  async getMeetingList(
    @Query('authorities') authorities: AuthorityEnumType[],
    @Token() user: AuthUser,
  ): Promise<MeetingListResponse> {
    return this.meetingService.getMeetingList(user.id, authorities);
  }

  @Public()
  @Get('lookAround')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully',
    type: MeetingListResponse,
  })
  async lookAroundMeetingList(): Promise<MeetingListResponse> {
    return this.meetingService.getMeetingList();
  }
}
