import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '@domain/meeting/entity/keyword.entity';
import { KeywordDao } from '@domain/meeting/dao/keyword.dao.interface';

@Injectable()
export class KeywordDaoImpl implements KeywordDao {
  constructor(@InjectRepository(Keyword) private keywordRepository: Repository<Keyword>) {}

  async countByMeetingId(meetingId: number): Promise<number> {
    return this.keywordRepository.count({
      where: { meetingId },
    });
  }

  async saveAll(keywords: Keyword[]): Promise<void> {
    await this.keywordRepository.save(keywords);
  }
}
