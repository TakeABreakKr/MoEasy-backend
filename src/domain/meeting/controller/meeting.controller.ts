import { Body, Controller, Get, Post, Query, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { UpdateMeetingRequest } from '../dto/request/update.meeting.request';
import { MeetingService } from '../service/meeting.service';
import { GetMeetingResponse } from '../dto/response/get.meeting.response';
import { GetMeetingListResponse } from '../dto/response/get.meeting.list.response';
import { UpdateMeetingThumbnailRequest } from '../dto/request/update.meeting.thumbnail.request';
import { AuthorityEnumType } from '../../../enums/authority.enum';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully created.' })
  @ApiConsumes('multipart/form-data')
  async createMeeting(@Body() request: CreateMeetingRequest): Promise<string> {
    const requester_id = 0; // TODO: getRequester info from token
    return this.meetingService.createMeeting(request, requester_id);
  }

  @Post('update')
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiBearerAuth()
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Basic values to modify meetings',
    type: UpdateMeetingRequest,
  })
  async updateMeeting(@Body() request: UpdateMeetingRequest): Promise<void> {
    await this.meetingService.updateMeeting(request);
  }

  @Post('update/thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully modified.' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  async updateMeetingThumbnail(@Body() request: UpdateMeetingThumbnailRequest): Promise<void> {
    await this.meetingService.updateMeetingThumbnail(request);
  }

  @Get('get')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting retrieved successfully',
  })
  @ApiQuery({
    name: 'meetingId',
  })
  async getMeeting(@Query('meetingId') meetingId: string): Promise<GetMeetingResponse> {
    return this.meetingService.getMeeting(meetingId);
  }

  @Get('get/list')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully',
  })
  @ApiBearerAuth()
  async getMeetingList(@Query('authorities') authorities: AuthorityEnumType[]): Promise<GetMeetingListResponse> {
    const requester_id: number = 0; // TODO: getRequester info from token
    return this.meetingService.getMeetingList(requester_id, authorities);
  }

  @Get('lookAround')
  @ApiOkResponse({
    status: 200,
    description: 'Meeting list retrieved successfully',
  })
  async lookAroundMeetingList(): Promise<GetMeetingListResponse> {
    return this.meetingService.getMeetingList();
  }
}
