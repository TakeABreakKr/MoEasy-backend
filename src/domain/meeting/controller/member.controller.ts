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
import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { MemberService } from '../service/member.service.interface';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { ErrorMessageType } from '@enums/error.message.enum';
import { AuthUser, Token } from '@decorator/token.decorator';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';
import { MemberJoinRequest } from '@domain/meeting/dto/request/member.join.request';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberWaitingListResponse } from '@domain/meeting/dto/response/member.waiting.list.response';

@ApiTags('member')
@Controller('member')
export class MemberController {
  constructor(@Inject('MemberService') private readonly memberService: MemberService) {}

  @Get('search')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'withdraw succeed', type: MemberSearchResponse })
  @ApiQuery({
    name: 'keyword',
    type: String,
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
    type: String,
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
  @ApiQuery({
    name: 'meetingId',
    type: String,
    required: true,
  })
  async withdraw(@Query('meetingId') meetingId: string, @Token() user: AuthUser) {
    await this.memberService.withdraw(user.id, meetingId);
  }

  @Post('authority/update')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'authority updated succeed' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data to update member authority',
    type: MemberAuthorityUpdateRequest,
  })
  async modify(@Body() req: MemberAuthorityUpdateRequest, @Token() user: AuthUser) {
    await this.memberService.updateAuthority(user.id, req);
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
    await this.memberService.deleteMember(user.id, req);
  }

  @Post('apply')
  @ApiBearerAuth()
  @ApiOkResponse({
    status: 200,
    description: 'The application has been successfully submitted and is awaiting approval.',
  })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.NOT_FOUND_MEETING })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data required for applying to become a meeting member.',
    type: MemberJoinRequest,
  })
  async apply(@Body() req: MemberJoinRequest, @Token() user: AuthUser) {
    return this.memberService.join(user.id, req);
  }

  @Get('waiting/get')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'waiting list retrieved successfully' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiQuery({ name: 'meetingId', type: String, required: true })
  async getWaiting(@Token() user: AuthUser): Promise<MemberWaitingListResponse> {
    return this.memberService.getWaitingList(user.id);
  }

  @Post('manage')
  @ApiBearerAuth()
  @ApiOkResponse({ status: 200, description: 'member join approved successfully' })
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('application/json')
  @ApiBody({
    description: 'data required for member approval',
    type: MemberJoinManageRequest,
  })
  async manageMemberJoin(req: MemberJoinManageRequest, @Token() user: AuthUser) {
    await this.memberService.manageMemberJoin(user.id, req);
  }
}
