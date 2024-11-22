import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '@domain/meeting/service/member.service.interface';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberController } from '@domain/meeting/controller/member.controller';
import { MemberWaitingListResponse } from '@domain/meeting/dto/response/member.waiting.list.response';
import { MemberResponse } from '@domain/meeting/dto/response/member.response';
import { AuthUser } from '@decorator/token.decorator';
import { MemberAuthorityUpdateRequest } from '@domain/meeting/dto/request/member.authority.update.request';
import { MemberDeleteRequest } from '@domain/meeting/dto/request/member.delete.request';
import { MemberJoinRequest } from '@domain/meeting/dto/request/member.join.request';
import { MemberJoinManageRequest } from '@domain/meeting/dto/request/member.join.manage.request';
import { AuthorityEnum } from '@enums/authority.enum';
import { MeetingUpdateRequest } from '@domain/meeting/dto/request/meeting.update.request';
import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

class MockMemberService implements MemberService {
  async search(): Promise<MemberSearchResponse> {
    throw new Error('Method not implemented.');
  }

  async getMember(meetingId: string): Promise<MemberResponse> {
    if (!meetingId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);
    return {
      username: 'yun',
      explanation: 'hi',
      authority: 'MEMBER',
    };
  }

  async withdraw(): Promise<void> {}

  async updateAuthority(id: number, req: MemberAuthorityUpdateRequest): Promise<void> {
    if (!req.usersId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);
    if (!req.meetingId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);
  }

  async deleteMember(id: number, req: MemberDeleteRequest): Promise<void> {
    if (!req.memberId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEMBER);
    if (!req.meetingId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);
  }

  async join(id: number, req: MemberJoinRequest): Promise<void> {
    if (!req.meetingId) throw new BadRequestException(ErrorMessageType.NOT_FOUND_MEETING);
  }

  async getWaitingList(): Promise<MemberWaitingListResponse> {
    return {
      meetings: [],
    };
  }

  async manageMemberJoin(): Promise<void> {}
}

describe('MemberControllerTest', () => {
  let memberController: MemberController;

  const meetingId = 'OOOOOOO1';
  const user: AuthUser = {
    id: 1,
    name: 'yun',
    issueDate: Date.now(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [{ provide: 'MemberService', useClass: MockMemberService }],
    }).compile();
    memberController = module.get<MemberController>(MemberController);
  });

  it('searchTest', async () => {});

  it('getMemberTest', async () => {
    const response: MemberResponse = {
      username: 'yun',
      explanation: 'hi',
      authority: AuthorityEnum.MEMBER,
    };
    const result = await memberController.getMember(meetingId, user.id);

    expect(result).toStrictEqual(response);
  });

  it('getMemberTest - Fail case : 400 Bad Request', async () => {
    await expect(memberController.getMember(undefined, user.id)).rejects.toThrow(BadRequestException);
    try {
      await memberController.getMember(undefined, user.id);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEETING);
    }
  });

  it('withdrawTest', async () => {
    const result = await memberController.withdraw(meetingId, user);
    expect(result).toBe(void 0);
  });

  it('withdrawTest - Fail case : 400 Bad Request', async () => {
    await expect(memberController.withdraw(undefined, user)).rejects.toThrow(BadRequestException);
    try {
      await memberController.withdraw(undefined, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEETING);
    }
  });

  it('withdrawTest - Fail case : 401 Unauthorized', async () => {
    try {
      await memberController.withdraw(meetingId, undefined);
    } catch (error) {
      expect(error).toBeInstanceOf(ApiUnauthorizedResponse);
      expect(error.message).toBe(ErrorMessageType.NOT_EXIST_REQUESTER);
    }
  });

  it('updateAuthorityTest', async () => {
    const request: MemberAuthorityUpdateRequest = {
      usersId: 2,
      meetingId: meetingId,
      isManager: false,
    };
    const result = await memberController.updateAuthority(request, user);
    expect(result).toBe(void 0);
  });

  it('updateAuthorityTest - Fail case : 400 Bad Request', async () => {
    const request: MemberAuthorityUpdateRequest = {
      usersId: undefined,
      meetingId: meetingId,
      isManager: false,
    };

    await expect(memberController.updateAuthority(request, user)).rejects.toThrow(BadRequestException);

    try {
      await memberController.updateAuthority(request, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEMBER);
    }
  });

  it('updateAuthorityTest - Fail case : 400 Bad Request', async () => {
    const request: MemberAuthorityUpdateRequest = {
      usersId: 2,
      meetingId: undefined,
      isManager: false,
    };

    await expect(memberController.updateAuthority(request, user)).rejects.toThrow(BadRequestException);

    try {
      await memberController.updateAuthority(request, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEETING);
    }
  });

  it('updateAuthorityTest - Fail case : 401 Unauthorized', async () => {});

  it('deleteMemberTest', async () => {
    const request: MemberDeleteRequest = {
      meetingId: meetingId,
      memberId: 2,
    };
    const result = await memberController.deleteMember(request, user);
    expect(result).toBe(void 0);
  });

  it('deleteMemberTest - Fail case : 400 Bad Request', async () => {
    const request: MemberDeleteRequest = {
      meetingId: undefined,
      memberId: 2,
    };
    await expect(memberController.deleteMember(request, user)).rejects.toThrow(BadRequestException);

    try {
      await memberController.deleteMember(request, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEETING);
    }
  });

  it('deleteMemberTest - Fail case : 400 Bad Request', async () => {
    const request: MemberDeleteRequest = {
      meetingId: meetingId,
      memberId: undefined,
    };
    await expect(memberController.deleteMember(request, user)).rejects.toThrow(BadRequestException);

    try {
      await memberController.deleteMember(request, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEMBER);
    }
  });

  it('deleteMemberTest - Fail case : 401 unAuthorized', async () => {});

  it('joinTest', async () => {
    const request: MemberJoinRequest = {
      meetingId: meetingId,
      joinMessage: 'plz',
    };
    const result = await memberController.join(request, user);
    expect(result).toBe(void 0);
  });

  it('joinTest - Fail case : 400 Bad Request', async () => {
    const request: MemberJoinRequest = {
      meetingId: undefined,
      joinMessage: 'plz',
    };

    await expect(memberController.join(request, user)).rejects.toThrow(BadRequestException);

    try {
      await memberController.join(request, user);
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
      expect(error.getStatus()).toBe(400);
      expect(error.message).toBe(ErrorMessageType.NOT_FOUND_MEETING);
    }
  });
  
  it('joinTest - Fail case : 401 Unauthorized', async () => {});

  it('getWaitingListTest', async () => {
    const result = await memberController.getWaitingList(user);
    const response: MemberWaitingListResponse = {
      meetings: [],
    };
    expect(result).toStrictEqual(response);
  });

  it('manageMemberJoinTest', async () => {
    const request: MemberJoinManageRequest = {
      meetingId: meetingId,
      memberId: 2,
      isAccepted: true,
    };
    const result = await memberController.manageMemberJoin(request, user);
    expect(result).toBe(void 0);
  });
});
