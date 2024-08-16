import * as request from 'supertest';
import { Server } from 'net';
import { getServer } from '../../default.test';
import { MeetingResponse } from '@domain/meeting/dto/response/meeting.response';

describe('meeting', () => {
  const getServerMethod: () => Promise<Server> = getServer();

  it('search (GET)', async () => {
    const httpServer: Server = await getServerMethod();
    const result: MeetingResponse = {
      name: '',
      explanation: '',
      limit: 1,
      members: [],
      thumbnail: undefined,
    };
    return request(httpServer).get('/meeting/get?meetingId=GGGGGGG1').expect(400).expect({
      statusCode: 400,
      message: 'wrong meeting id requested',
    });
  });
});
