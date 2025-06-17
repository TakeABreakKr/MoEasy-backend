import { Inject, Injectable } from '@nestjs/common';
import { KeywordComponent } from '@domain/meeting/component/keyword.component.interface';
import { Keyword } from '@domain/meeting/entity/keyword.entity';
import { KeywordDao } from '@domain/meeting/dao/keyword.dao.interface';

@Injectable()
export class KeywordComponentImpl implements KeywordComponent {
  constructor(@Inject('KeywordDao') private keywordDao: KeywordDao) {}

  public async countByMeetingId(meetingId: number): Promise<number> {
    return this.keywordDao.countByMeetingId(meetingId);
  }

  public async saveAll(keywords: Keyword[]): Promise<void> {
    await this.keywordDao.saveAll(keywords);
  }
}
