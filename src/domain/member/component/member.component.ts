import { Inject, Injectable } from '@nestjs/common';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { Member } from '@domain/member/entity/member.entity';
import { MemberDao } from '@domain/member/dao/member.dao.interface';
import { AuthorityEnumType } from '@root/enums/authority.enum';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

@Injectable()
export class MemberComponentImpl implements MemberComponent {
  constructor(@Inject('MemberDao') private memberDao: MemberDao) {}

  public async saveAll(members: Member[]): Promise<void> {
    await this.memberDao.saveAll(members);
  }

  public async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.memberDao.findByMeetingId(meetingId);
  }

  public async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.memberDao.findByUsersAndMeetingId(usersId, meetingId);
  }

  public async findByUserId(usersId: number): Promise<Member[]> {
    return this.memberDao.findByUserId(usersId);
  }

  public async findByUsersAndAuthorities(usersId: number, authority: AuthorityEnumType[]): Promise<Member[]> {
    return this.memberDao.findByUsersAndAuthorities(usersId, authority);
  }

  public async create(createMemberDto: CreateMemberDto): Promise<Member> {
    return this.memberDao.create(createMemberDto);
  }

  public async updateAuthority(member: Member, authority: AuthorityEnumType): Promise<void> {
    await this.memberDao.updateAuthority(member, authority);
  }

  public async deleteByUsersAndMeetingId(usersId: number, meetingId: number): Promise<void> {
    await this.memberDao.deleteByUsersAndMeetingId(usersId, meetingId);
  }
}
