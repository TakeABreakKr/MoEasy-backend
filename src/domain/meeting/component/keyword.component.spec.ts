import { Test, TestingModule } from '@nestjs/testing';
import { KeywordDao } from '@domain/meeting/dao/keyword.dao.interface';
import { KeywordComponentImpl } from '@domain/meeting/component/keyword.component';
import { KeywordComponent } from '@domain/meeting/component/keyword.component.interface';
import { Keyword } from '@domain/meeting/entity/keyword.entity';

class MockKeywordDao implements KeywordDao {
  public mockKeywords: Keyword[] = [Keyword.create('테스트 키워드 1', 100), Keyword.create('테스트 키워드 2', 200)];

  async countByMeetingId(meetingId: number): Promise<number> {
    return this.mockKeywords.filter((keyword) => keyword.meetingId === meetingId).length;
  }

  async saveAll(keywords: Keyword[]): Promise<void> {
    this.mockKeywords.push(...keywords);
  }
}

describe('KeywordComponent', () => {
  let keywordComponent: KeywordComponent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'KeywordDao',
          useClass: MockKeywordDao,
        },
        {
          provide: 'KeywordComponent',
          useClass: KeywordComponentImpl,
        },
      ],
    }).compile();

    keywordComponent = module.get<KeywordComponent>('KeywordComponent');
  });

  it('countByMeetingIdTest ', async () => {
    const result = await keywordComponent.countByMeetingId(100);
    expect(result).toBe(1);

    const result2 = await keywordComponent.countByMeetingId(200);
    expect(result2).toBe(1);
  });

  it('saveAllTest', async () => {
    const keywordsData = [Keyword.create('새 키워드 1', 100), Keyword.create('새 키워드 2', 200)];

    await keywordComponent.saveAll(keywordsData);

    const count100 = await keywordComponent.countByMeetingId(100);
    expect(count100).toBe(2);

    const count200 = await keywordComponent.countByMeetingId(200);
    expect(count200).toBe(2);
  });
});
