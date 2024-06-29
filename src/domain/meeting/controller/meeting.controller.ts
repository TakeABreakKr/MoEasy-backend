import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateMeetingRequest } from '../dto/request/create.meeting.request';
import { MeetingService } from '../service/meeting.service';

@ApiTags('meeting')
@Controller('meeting')
export class MeetingController {
  constructor(private meetingService: MeetingService) {}

  @Post('create')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({ status: 200, description: 'Meeting Entity has been successfully created.' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'Values that needs to create meeting entity.',
    type: CreateMeetingRequest,
  })
  async createMeeting(
    @Body() request: CreateMeetingRequest,
    @UploadedFile() thumbnail: Express.Multer.File,
  ): Promise<void> {
    const requester_id = 0; // TODO: getRequester info from token
    await this.meetingService.createMeeting(request, thumbnail, requester_id);
  }
}
