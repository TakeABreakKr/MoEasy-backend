import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keyword } from '../entity/keyword.entity';

@Injectable()
export class KeywordDao {
  constructor(@InjectRepository(Keyword) private keywordRepository: Repository<Keyword>) {}

  async saveAll(keywords: Keyword[]) {
    await this.keywordRepository.save(keywords);
  }
}
