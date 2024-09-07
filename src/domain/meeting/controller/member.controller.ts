import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { MemberService } from '../service/member.service.interface';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberInviteRequest } from '../dto/request/member.invite.request';
import { ErrorMessageType } from '@enums/error.message.enum';
import { AuthUser, Token } from '@decorator/token.decorator';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(@Inject('MemberService') private readonly memberService: MemberService) {}

  @Get('search')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed', type: MemberSearchResponse })
  async search(@Query() keyword: string): Promise<MemberSearchResponse> {
    return this.memberService.search(keyword);
  }

  @Post('withdraw')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({})
  async withdraw(@Body('meetingId') meeting_id: string, @Token() user: AuthUser) {
    await this.memberService.withdraw(user.id, meeting_id);
  }

  @Post('invite')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'invite url created', type: String })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiForbiddenResponse({ status: 403, description: ErrorMessageType.FORBIDDEN_INVITE_REQUEST })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'necessary info for invite to meeting',
    type: MemberInviteRequest,
  })
  async invite(@Body() req: MemberInviteRequest, @Token() user: AuthUser): Promise<string> {
    return this.memberService.invite(user.id, req);
  }

  @Get('invite/accept')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'invite accepted successfully' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.WRONG_INVITE_URL })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.MALFORMED_INVITE_URL })
  async accept(@Query('usersId') usersId: number, @Query('meetingId') meetingId: string, @Token() user: AuthUser) {
    await this.memberService.accept(user.id, usersId, meetingId);
  }
}
