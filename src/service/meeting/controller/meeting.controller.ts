import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import AuthGuard from '@root/middleware/auth/auth.guard';
import { ApiCommonResponse } from '@decorator/api.common.response.decorator';
import { ImageFileFilter } from '@root/utils/image.filter.utils';

@UseGuards(AuthGuard)
@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(@Inject('MeetingService') private readonly meetingService: MeetingService) {}

  @Post('create')
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: ImageFileFilter.filter,
    }),
  )
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MeetingCreateRequest,
    description: 'data required to create a new meeting',
  })
  async createMeeting(
    @Body() request: MeetingCreateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Token() user: AuthUser,
  ): Promise<string> {
    request.thumbnail = file;
    return this.meetingService.createMeeting(request, user.id);
  }

  @Post('update')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
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
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @UseInterceptors(
    FileInterceptor('thumbnail', {
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
      fileFilter: ImageFileFilter.filter,
    }),
  )
  @ApiCommonResponse()
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: MeetingThumbnailUpdateRequest,
    description: 'data required to update thumbnail',
  })
  async updateMeetingThumbnail(
    @Body() request: MeetingThumbnailUpdateRequest,
    @UploadedFile() file: Express.Multer.File,
    @Token() user: AuthUser,
  ): Promise<void> {
    request.thumbnail = file;
    await this.meetingService.updateMeetingThumbnail(request, user.id);
  }

  @Get('delete')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
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
  @ApiExtraModels(MeetingResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(MeetingResponse) })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiQuery({
    name: 'meetingId',
    type: String,
    required: true,
  })
  async getMeeting(@Query('meetingId') meetingId: string, @Token() user: AuthUser): Promise<MeetingResponse> {
    return this.meetingService.getMeeting(meetingId, user.id);
  }

  @Post('get/list')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiExtraModels(MeetingListResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(MeetingListResponse) })
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
        onlyLiked: {
          type: 'boolean',
          description: 'If true, return only liked meetings.',
        },
      },
    },
  })
  async getMeetingList(
    @Token() user: AuthUser,
    @Body('authorities') authorities?: AuthorityEnumType[],
    @Body('options') options?: OrderingOptionEnumType,
    @Body('onlyLiked') onlyLiked?: boolean,
  ): Promise<MeetingListResponse> {
    return this.meetingService.getMeetingList(user.id, authorities, options, onlyLiked);
  }

  @Public()
  @Get('lookAround')
  @ApiExtraModels(MeetingListResponse)
  @ApiCommonResponse({ $ref: getSchemaPath(MeetingListResponse) })
  async lookAroundMeetingList(): Promise<MeetingListResponse> {
    return this.meetingService.getMeetingList();
  }

  @Post('like')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiQuery({
    name: 'meetingId',
    type: String,
    required: true,
  })
  async likeMeeting(@Query() meetingId: string, @Token() user: AuthUser): Promise<void> {
    await this.meetingService.likeMeeting(meetingId, user.id);
  }
}
