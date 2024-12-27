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
import { Body, Controller, Get, Inject, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MeetingCreateRequest } from '@service/meeting/dto/request/meeting.create.request';
import { MeetingUpdateRequest } from '@service/meeting/dto/request/meeting.update.request';
import { MeetingResponse } from '@service/meeting/dto/response/meeting.response';
import { MeetingListResponse } from '@service/meeting/dto/response/meeting.list.response';
import { MeetingThumbnailUpdateRequest } from '@service/meeting/dto/request/meeting.thumbnail.update.request';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { MeetingService } from '@service/meeting/service/meeting.service.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { OrderingOptionEnum, OrderingOptionEnumType } from '@enums/ordering.option.enum';
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
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MeetingCreateRequest,
    description: 'data required to create a new meeting',
  })
  async createMeeting(@Body() request: MeetingCreateRequest, @Token() user: AuthUser): Promise<string> {
    return this.meetingService.createMeeting(request, user.id);
  }

  @Post('update')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Basic values to modify meetings',
    type: MeetingUpdateRequest,
  })
  async updateMeeting(@Body() request: MeetingUpdateRequest, @Token() user: AuthUser): Promise<void> {
    await this.meetingService.updateMeeting(request, user.id);
  }

  @Post('update/thumbnail')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MeetingThumbnailUpdateRequest,
    description: 'data required to update thumbnail',
  })
  async updateMeetingThumbnail(@Body() request: MeetingThumbnailUpdateRequest, @Token() user: AuthUser): Promise<void> {
    await this.meetingService.updateMeetingThumbnail(request, user.id);
  }

  @Get('delete')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully deleted.' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiQuery({
    name: 'meetingId',
    type: String,
    required: true,
  })
  async deleteMeeting(@Query('meetingId') meetingId: string, @Token() user: AuthUser): Promise<void> {
    await this.meetingService.deleteMeeting(meetingId, user.id);
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
    type: String,
    required: true,
  })
  async getMeeting(@Query('meetingId') meetingId: string): Promise<MeetingResponse> {
    return this.meetingService.getMeeting(meetingId);
  }

  @Post('get/list')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully.',
    type: MeetingListResponse,
  })
  @ApiBody({
    description: 'Filter meetings by authority and sort by options.',
    schema: {
      type: 'object',
      properties: {
        authorities: {
          type: 'array',
          items: {
            type: 'string',
            enum: Object.values(AuthorityEnum),
          },
          description: 'List of authority types to filter meetings.',
        },
        options: {
          type: 'string',
          enum: [OrderingOptionEnum.LATEST, OrderingOptionEnum.NAME],
          description: 'Option to sort meetingList (LATEST for latest registered, NAME for alphabetical).',
        },
      },
    },
  })
  async getMeetingList(
    @Body('authorities') authorities: AuthorityEnumType[],
    @Body('options') options: OrderingOptionEnumType,
    @Token() user: AuthUser,
  ): Promise<MeetingListResponse> {
    return this.meetingService.getMeetingList(user.id, authorities, options);
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
