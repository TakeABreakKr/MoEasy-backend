import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { MemberService } from '../service/member.service.interface';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberInviteRequest } from '../dto/request/member.invite.request';
import { ErrorMessageType } from '@enums/error.message.enum';
import { AuthUser, Token } from '@decorator/token.decorator';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberAuthorityModifyRequest } from '@domain/meeting/dto/request/member.authority.modify.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(@Inject('MemberService') private readonly memberService: MemberService) {}

  @Get('search')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed', type: MemberSearchResponse })
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: true,
  })
  async search(@Query() keyword: string): Promise<MemberSearchResponse> {
    return this.memberService.search(keyword);
  }

  @Get('get')
  @ApiOkResponse({
    status: 200,
    description: 'Member retrieved successfully',
    type: MemberResponse,
  })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEMBER })
  @ApiQuery({
    name: 'meetingId',
    type: 'string',
    required: true,
  })
  @ApiQuery({
    name: 'userId',
    type: Number,
    required: true,
  })
  async getMember(@Query('meetingId') meetingId: string, @Query('userId') userId: number): Promise<MemberResponse> {
    return this.memberService.getMember(meetingId, userId);
  }

  @Get('withdraw')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiQuery({
    name: 'meetingId',
    type: 'string',
    required: true,
  })
  async withdraw(@Query('meetingId') meetingId: string, @Token() user: AuthUser) {
    await this.memberService.withdraw(user.id, meetingId);
  }

  @Post('authority/modify')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'authority modified succeed' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data for modifying member authority',
    type: MemberAuthorityModifyRequest,
  })
  async modify(@Body() req: MemberAuthorityModifyRequest, @Token() user: AuthUser) {
    await this.memberService.modifyAuthority(user.id, req);
  }

  @Post('delete')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'member deleted successfully' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'info for deleting a member',
    type: MemberDeleteRequest,
  })
  async delete(@Body() req: MemberDeleteRequest, @Token() user: AuthUser) {
    await this.memberService.delete(user.id, req);
  }

  //기획 결정 후 변경
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
  @ApiQuery({
    name: 'usersId',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'meetingId',
    type: 'string',
    required: true,
  })
  async accept(@Query('usersId') usersId: number, @Query('meetingId') meetingId: string, @Token() user: AuthUser) {
    await this.memberService.accept(user.id, usersId, meetingId);
  }

  @Get('invite/approve')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'member approved successfully' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiQuery({
    name: 'requesterId',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'usersId',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'meetingId',
    type: 'string',
    required: true,
  })
  async approve(
    @Query('requesterId') requesterId: number,
    @Query('userId') usersId: number,
    @Query('meetingId') meetingId: string,
  ) {
    await this.memberService.approve(requesterId, usersId, meetingId);
  }
}
