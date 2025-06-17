import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { Meeting } from '@domain//meeting/entity/meeting.entity';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { BaseEntity } from '@domain/common/base.entity';
import { CreateMemberDto } from '@domain/member/dto/create.member.dto';

@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn({
    name: 'users_id',
  })
  userId: number;

  @PrimaryColumn({
    name: 'meeting_id',
  })
  meetingId: number;

  @ManyToOne(() => Users, (user) => user.members, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  @ManyToOne(() => Meeting, (meeting) => meeting.members, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @Column({
    type: 'enum',
    enum: AuthorityEnum,
    default: AuthorityEnum.WAITING,
  })
  authority: AuthorityEnumType;

  @Column({
    type: String,
  })
  applicationMessage: string;

  static create({ meetingId, userId, authority, applicationMessage }: CreateMemberDto): Member {
    const member = new Member();
    member.meetingId = meetingId;
    member.userId = userId;
    member.authority = authority;

    if (applicationMessage) {
      member.applicationMessage = applicationMessage;
    }
    return member;
  }

  async getUser(): Promise<Users> {
    return this.user;
  }

  async getMeeting(): Promise<Meeting> {
    return this.meeting;
  }

  updateAuthority(authority: AuthorityEnumType) {
    this.authority = authority;
  }
}
