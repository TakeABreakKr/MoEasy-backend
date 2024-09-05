import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { MemberService } from '../service/member.service';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberInviteRequest } from '../dto/request/member.invite.request';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(private memberService: MemberService) {}

  @Get('search')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed', type: MemberSearchResponse })
  async search(@Query() keyword: string): Promise<MemberSearchResponse> {
    return this.memberService.search(keyword);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed' })
  @ApiConsumes('application/json')
  @ApiBody({})
  async withdraw(@Body('meetingId') meeting_id: string) {
    const requester_id: number = 0; // TODO: getRequester info from token
    await this.memberService.withdraw(requester_id, meeting_id);
  }

  @Post('invite')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'invite url created' })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'necessary info for invite to meeting',
    type: MemberInviteRequest,
  })
  async invite(@Body() req: MemberInviteRequest) {
    const requester_id: number = 0; // TODO: getRequester info from token
    await this.memberService.invite(requester_id, req);
  }

  @Get('invite/accept')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'invite accepted successfully' })
  async accept(@Query('usersId') usersId: number, @Query('meetingId') meetingId: string) {
    const requester_id: number = 0; // TODO: getRequester info from token
    await this.memberService.accept(requester_id, usersId, meetingId);
  }

  @Get('invite/approve')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'member approved successfully' })
  async approve(
    @Query('requesterId') requesterId: number,
    @Query('userId') usersId: number,
    @Query('meetingId') meetingId: string,
  ) {
    await this.memberService.approve(requesterId, usersId, meetingId);
  }
}
