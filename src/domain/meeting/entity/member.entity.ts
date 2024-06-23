import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Users } from '../../user/entity/users.entity';
import { Meeting } from './meeting.entity';
import { AuthorityEnum, AuthorityEnumType } from '../../../enums/authority.enum';

@Entity()
export class Member {
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
}
