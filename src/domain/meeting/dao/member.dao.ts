import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';

@Injectable()
export class MemberDao {
  constructor(
    @InjectRepository(Member) private memberRepository: Repository<Member>,
  ) {}
}
