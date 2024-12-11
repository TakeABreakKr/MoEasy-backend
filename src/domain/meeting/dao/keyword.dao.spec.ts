import { Repository } from 'typeorm';
import { Keyword } from '../entity/keyword.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { KeywordDaoImpl } from './keyword.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KeywordDao } from './keyword.dao.interface';

type CountOptions = {
  where: {
    meeting: {
      meeting_id: number;
    };
  };
};

class MockKeywordRepository extends Repository<Keyword> {
  async count(option: CountOptions): Promise<number> {
    if (option.where.meeting.meeting_id === 1) {
      return 3;
    }
    return 0;
  }

  async save(keywords: Keyword[]): Promise<Keyword[]> {
    return keywords;
  }
}

describe('KeywordDao', () => {
  let keywordDao: KeywordDao;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: 'KeywordDao', useClass: KeywordDaoImpl },
        { provide: getRepositoryToken(Keyword), useClass: MockKeywordRepository },
      ],
    }).compile();

    keywordDao = module.get<KeywordDao>('KeywordDao');
  });

  it('countByMeetingIdTest', async () => {
    const meetingId = 1;

    const result = await keywordDao.countByMeetingId(meetingId);

    expect(result).toBe(3);
  });

  it('saveAllTest', async () => {
    const keywords = [Keyword.create('test1', 1), Keyword.create('test2', 1)];
    await keywordDao.saveAll(keywords);
  });
});
