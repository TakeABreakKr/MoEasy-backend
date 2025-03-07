import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Member } from '@domain/member/entity/member.entity';
import { AuthorityEnumType } from '@enums/authority.enum';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

@Injectable()
export class MemberDaoImpl implements MemberDao {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async saveAll(members: Member[]): Promise<void> {
    await this.memberRepository.save(members);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.memberRepository.findOneBy({ users_id: usersId, meeting_id: meetingId });
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    return this.memberRepository.findBy({ meeting_id });
  }

  async findByUsersAndAuthorities(users_id: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.memberRepository.findBy({ users_id: users_id, authority: In(authority) });
  }

  async findByUserId(users_id: number): Promise<Member[]> {
    return this.memberRepository.findBy({ users_id: users_id });
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    const member: Member = Member.create(createMemberDto);
    await this.memberRepository.save(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    member.updateAuthority(authority);
    await this.memberRepository.save(member);
  }

  async deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void> {
    await this.memberRepository.delete({ users_id: usersId, meeting_id: meetingId });
  }
}
