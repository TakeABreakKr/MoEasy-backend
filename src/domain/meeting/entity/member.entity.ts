import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { Meeting } from './meeting.entity';
import { AuthorityEnum, AuthorityEnumType } from '@enums/authority.enum';
import { BaseEntity } from '@domain/common/base.entity';

type CreateMemberDto = {
  meeting_id: number;
  users_id: number;
  authority?: AuthorityEnumType;
  waitingNumber?: number;
};

@Entity()
export class Member extends BaseEntity {
  @PrimaryColumn()
  users_id: number;

  @PrimaryColumn()
  meeting_id: number;

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
    type: 'integer',
    default: null,
  })
  waitingNumber: number | null;

  static create({ meeting_id, users_id, authority, waitingNumber }: CreateMemberDto): Member {
    const member = new Member();
    member.meeting_id = meeting_id;
    member.users_id = users_id;
    if (authority) {
      member.authority = authority;
    }
    if (waitingNumber) {
      member.waitingNumber = waitingNumber;
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
