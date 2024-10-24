import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from '../entity/member.entity';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';

type CreateMemberType = {
  meetingId: number;
  usersId: number;
  authority?: AuthorityEnumType;
  applicationMessage?: string;
};

@Injectable()
export class MemberDao {
  constructor(@InjectRepository(Member) private memberRepository: Repository<Member>) {}

  async saveAll(members: Member[]) {
    await this.memberRepository.save(members);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.memberRepository.findOneBy({ users_id: usersId, meeting_id: meetingId });
  }

  async findByMeetingId(meeting_id: number): Promise<Member[]> {
    return this.memberRepository.findBy({ meeting_id });
  }

  async create({
    meetingId,
    usersId,
    authority = AuthorityEnum.WAITING,
    applicationMessage,
  }: CreateMemberType): Promise<Member> {
    const member: Member = this.memberRepository.create({
      meeting_id: meetingId,
      users_id: usersId,
      authority: authority,
      appliedAt: new Date(),
      applicationMessage: applicationMessage,
    });
    await this.memberRepository.save(member);
    return member;
  }

  async updateAuthority(member: Member, authority: AuthorityEnumType) {
    member.updateAuthority(authority);
    await this.memberRepository.save(member);
  }

  async deleteByUsersAndMeetingId(usersId: number, meetingId: number) {
    await this.memberRepository.delete({ users_id: usersId, meeting_id: meetingId });
  }
}
