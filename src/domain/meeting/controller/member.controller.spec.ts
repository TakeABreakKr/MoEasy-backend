import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '../service/member.service.interface';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberController } from '../controller/member.controller';
import { MemberWaitingListResponse } from '../dto/response/member.waiting.list.response';
import { MemberResponse } from '../dto/response/member.response';
import { AuthUser } from '@decorator/token.decorator';
import { MemberAuthorityUpdateRequest } from '../dto/request/member.authority.update.request';
import { MemberDeleteRequest } from '../dto/request/member.delete.request';
import { MemberJoinRequest } from '../dto/request/member.join.request';
import { MemberJoinManageRequest } from '../dto/request/member.join.manage.request';
import { AuthorityEnum } from '@enums/authority.enum';

class MockMemberService implements MemberService {
  async search(): Promise<MemberSearchResponse> {
    throw new Error('Method not implemented.');
  }

  async getMember(): Promise<MemberResponse> {
    return {
      username: 'yun',
      explanation: 'hi',
      authority: 'MEMBER',
    };
  }

  async withdraw(): Promise<void> {}

  async updateAuthority(): Promise<void> {}

  async deleteMember(): Promise<void> {}

  async join(): Promise<void> {}

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

  it('withdrawTest', async () => {
    const result = await memberController.withdraw(meetingId, user);
    expect(result).toBe(void 0);
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

  it('deleteMemberTest', async () => {
    const request: MemberDeleteRequest = {
      meetingId: meetingId,
      memberId: 2,
    };
    const result = await memberController.deleteMember(request, user);
    expect(result).toBe(void 0);
  });

  it('joinTest', async () => {
    const request: MemberJoinRequest = {
      meetingId: meetingId,
      joinMessage: 'plz',
    };
    const result = await memberController.join(request, user);
    expect(result).toBe(void 0);
  });

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
