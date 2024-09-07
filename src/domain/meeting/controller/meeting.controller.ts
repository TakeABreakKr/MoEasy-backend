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
import { OrderingOptionEnum, OrderingOptionEnumType } from '@enums/ordering.option.enum';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(@Inject('MeetingService') private readonly meetingService: MeetingService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully created.' })
  @ApiConsumes('multipart/form-data')
  async createMeeting(@Body() request: MeetingCreateRequest): Promise<string> {
    const requester_id = 0; // TODO: getRequester info from token
    return this.meetingService.createMeeting(request, requester_id);
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

  @Post('get/list')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully',
    type: MeetingListResponse,
  })
  @ApiBearerAuth()
  @ApiBody({
    description: 'Filer meetings by authority and sort by options',
    schema: {
      type: 'object',
      properties: {
        authorities: {
          type: 'string',
          items: { type: 'string' },
          description: 'List of authority types to filter meetings',
        },
        options: {
          type: 'string',
          enum: [OrderingOptionEnum.LATEST, OrderingOptionEnum.NAME],
          description: 'Option to sort meetingList (LATEST for latest registered, NAME for alphabetical)',
        },
      },
    },
  })
  async getMeetingList(
    @Body('authorities') authorities: AuthorityEnumType[],
    @Body('options') options: OrderingOptionEnumType,
  ): Promise<MeetingListResponse> {
    const requester_id: number = 0; // TODO: getRequester info from token
    return this.meetingService.getMeetingList(requester_id, authorities, options);
  }

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
