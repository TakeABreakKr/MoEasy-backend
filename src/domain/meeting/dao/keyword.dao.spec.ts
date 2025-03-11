import { FindManyOptions, Repository } from 'typeorm';
import { Keyword } from '../entity/keyword.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { KeywordDaoImpl } from './keyword.dao';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KeywordDao } from './keyword.dao.interface';

class MockKeywordRepository extends Repository<Keyword> {
  public mockKeywords: Keyword[] = [Keyword.create('테스트 키워드', 100), Keyword.create('테스트 키워드', 200)];

  async count(options: FindManyOptions<Keyword>): Promise<number> {
    const meetingId = options.where['meetingId'];

    return this.mockKeywords.filter((keyword) => keyword.meetingId === meetingId).length;
  }

  async save(keywords: Keyword[]): Promise<Keyword[]> {
    const toSave = Array.isArray(keywords) ? keywords : [keywords];
    this.mockKeywords.push(...toSave);
    return toSave;
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
    const result = await keywordDao.countByMeetingId(100);
    expect(result).toBe(1);

    const result2 = await keywordDao.countByMeetingId(200);
    expect(result2).toBe(1);
  });

  it('saveAllTest', async () => {
    const keywordsData = [Keyword.create('새 키워드 1', 100), Keyword.create('새 키워드 2', 200)];

    await keywordDao.saveAll(keywordsData);

    const count100 = await keywordDao.countByMeetingId(100);
    expect(count100).toBe(2);

    const count200 = await keywordDao.countByMeetingId(200);
    expect(count200).toBe(2);
  });
});
