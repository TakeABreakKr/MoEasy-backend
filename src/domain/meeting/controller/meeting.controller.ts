import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeetingResponse } from '../dto/response/create.meeting.response';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { MeetingService } from '../service/meeting.service';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @ApiResponse({ status: 200, description: 'Meeting Entity has been successfully created.' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Values that needs to create meeting entity.',
    type: CreateMeetingRequest,
  })
  async createMeeting(@Body() request: CreateMeetingRequest): Promise<CreateMeetingResponse> {
    return this.meetingService.createMeeting(request);
  }
}
