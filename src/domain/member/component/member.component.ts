import { Inject, Injectable } from '@nestjs/common';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { Member } from '@domain/member/entity/member.entity';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

@Injectable()
export class MemberComponentImpl implements MemberComponent {
  constructor(@Inject('MemberDao') private memberDao: MemberDao) {}

  async saveAll(members: Member[]): Promise<void> {
    await this.memberDao.saveAll(members);
  }

  async countByMeetingIdAndAuthority(meetingId: number, authority: AuthorityEnumType): Promise<number> {
    return this.memberDao.countByMeetingIdAndAuthority(meetingId, authority);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.memberDao.findByMeetingId(meetingId);
  }

  async findByUsersAndMeetingId(userId: number, meetingId: number): Promise<Member | null> {
    return this.memberDao.findByUsersAndMeetingId(userId, meetingId);
  }

  async findByUserIdsAndMeetingId(userIds: number[], meetingId: number): Promise<Member[]> {
    return this.memberDao.findByUserIdsAndMeetingId(userIds, meetingId);
  }

  async findByUserId(userId: number): Promise<Member[]> {
    return this.memberDao.findByUserId(userId);
  }

  async getMostPopularMeetingIds(): Promise<number[]> {
    const popularMeetingCount = 30;
    return this.memberDao.getMostPopularMeetingIds(popularMeetingCount);
  }

  async getMemberCount(meetingId: number): Promise<number> {
    return this.memberDao.getMemberCountByMeetingId(meetingId);
  }

  async findByUsersAndAuthorities(userId: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.memberDao.findByUsersAndAuthorities(userId, authority);
  }

  async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberDao.create(createMemberDto);
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    await this.memberDao.updateAuthority(member, authority);
  }

  async deleteByUsersAndMeetingId(userId: number, meetingId: number): Promise<void> {
    await this.memberDao.deleteByUsersAndMeetingId(userId, meetingId);
  }
}
