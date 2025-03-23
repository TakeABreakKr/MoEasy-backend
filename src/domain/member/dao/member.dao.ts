import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Member } from '@domain/member/entity/member.entity';
import { AuthorityEnumType } from '@enums/authority.enum';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

type PopularMeetingDto = { meetingId: number; memberCount: number };

@Injectable()
export class MemberDaoImpl implements MemberDao {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async saveAll(members: Member[]): Promise<void> {
    await this.memberRepository.save(members);
  }

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    return this.memberRepository.findOneBy({ userId, meetingId });
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.memberRepository.findBy({
      userId: In(userIds),
      meetingId,
    });
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.memberRepository.findBy({ meetingId });
  }

  async findByUsersAndAuthorities(userId: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.memberRepository.findBy({ userId, authority: In(authority) });
  }

  async findByUserId(userId: number): Promise<Member[]> {
    return this.memberRepository.findBy({ userId });
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

  async deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void> {
    await this.memberRepository.delete({ userId, meetingId });
  }

  async getMemberCountByMeetingId(meetingId: number): Promise<number> {
    return this.memberRepository.countBy({ meetingId });
  }

  async getMostPopularMeetingIds(popularMeetingCount: number): Promise<number[]> {
    const popularMeetingDtoList: PopularMeetingDto[] = await this.memberRepository
      .createQueryBuilder('member')
      .select('member.meeting_id')
      .addSelect('COUNT(member.meeting_id)', 'memberCount')
      .groupBy('member.meeting_id')
      .orderBy('memberCount', 'DESC')
      .limit(popularMeetingCount)
      .getRawMany<PopularMeetingDto>();

    return popularMeetingDtoList.map((popularMeetingDto) => popularMeetingDto.meetingId);
  }
}
