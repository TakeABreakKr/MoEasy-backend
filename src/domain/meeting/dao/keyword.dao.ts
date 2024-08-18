import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { Keyword } from '../entity/keyword.entity';

@Injectable()
export class KeywordDao {
  constructor(@InjectRepository(Keyword) private keywordRepository: Repository<Keyword>) {}

  async countByMeetingId(meetingId: number): Promise<number>{
    const kewordsCount = await this.keywordRepository.count({
      where: { meeting: { meeting_id: meetingId } },
    });
    return kewordsCount;
  }

  async saveAll(keywords: Keyword[]) {
    await this.keywordRepository.save(keywords);
  }
}
