import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from '@domain/meeting/service/member.service.interface';
import { MemberInviteRequest } from '../dto/request/member.invite.request';
import { MemberSearchResponse } from '../dto/response/member.search.response';
import { MemberController } from '@domain/meeting/controller/member.controller';

class MockMemberService implements MemberService {
  search(keyword: string): Promise<MemberSearchResponse> {
    throw new Error('Method not implemented.');
  }

  withdraw(requester_id: number, meeting_id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  invite(requester_id: number, request: MemberInviteRequest): Promise<string> {
    throw new Error('Method not implemented.');
  }

  accept(requester_id: number, usersId: number, meetingId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

describe('MemberControllerTest', () => {
  let memberController: MemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [{ provide: 'MemberService', useClass: MockMemberService }],
    }).compile();
    memberController = module.get<MemberController>(MemberController);
  });
});
