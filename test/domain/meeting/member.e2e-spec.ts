import * as request from 'supertest';
import { Server } from 'net';
import { getServer } from '../../default.test';
import { MemberSearchResponse } from '@service/member/dto/response/member.search.response';

describe('member', () => {
  const getServerMethod: () => Promise<Server> = getServer();

  it('search (GET)', async () => {
    const httpServer: Server = await getServerMethod();
    const result: MemberSearchResponse = {
      memberList: [],
    };
    return request(httpServer).get('/member/search?keyword=').expect(200).expect(result);
  });
});
