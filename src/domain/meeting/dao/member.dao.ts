import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';

@Injectable()
export class MemberDao {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async saveAll(members: Member[]) {
    await this.memberRepository.save(members);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member> {
    return this.memberRepository.findOneBy({ users_id: usersId, meeting_id: meetingId });
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    return this.memberRepository.findBy({ meeting_id });
  }
}
