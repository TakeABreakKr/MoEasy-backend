import * as request from 'supertest';
import { Server } from 'net';
import { getServer } from './default.test';

describe('app', () => {
  const getServerMethod: () => Promise<Server> = getServer();

  it('/ (GET)', async () => {
    const httpServer: Server = await getServerMethod();
    return request(httpServer).get('/').expect(200).expect('Hello World!');
  });
});
