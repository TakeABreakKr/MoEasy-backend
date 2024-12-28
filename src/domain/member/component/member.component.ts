import { Inject, Injectable } from '@nestjs/common';
import { MemberComponent } from '@domain/member/component/member.component.interface';
import { Member } from '@domain/member/entity/member.entity';
import { MemberDao } from '@domain/member/dao/member.dao.interface';

@Injectable()
export class MemberComponentImpl implements MemberComponent {
  constructor(@Inject('MemberDao') private memberDao: MemberDao) {}

  async saveAll(members: Member[]): Promise<void> {
    await this.memberDao.saveAll(members);
  }

  async findByMeetingId(meetingId: number): Promise<Member[]> {
    return this.memberDao.findByMeetingId(meetingId);
  }

  async findByUsersAndMeetingId(usersId: number, meetingId: number): Promise<Member | null> {
    return this.memberDao.findByUsersAndMeetingId(usersId, meetingId);
  }

  async findByUserId(usersId: number): Promise<Member[]> {
    return this.memberDao.findByUserId(usersId);
  }
}
