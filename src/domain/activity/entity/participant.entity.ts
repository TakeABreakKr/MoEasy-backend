import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { Users } from '@domain/user/entity/users.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { CreateParticipantDto } from '@domain/activity/dto/create.participant.dto';
import { AuthorityEnum, AuthorityEnumType } from '@root/enums/authority.enum';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryColumn({
    name: 'activity_id',
  })
  activityId: number;

  @PrimaryColumn({
    name: 'users_id',
  })
  userId: number;

  @Column({
    type: 'enum',
    enum: AuthorityEnum,
    default: AuthorityEnum.WAITING,
  })
  authority: AuthorityEnumType;

  @ManyToOne(() => Activity, (activity) => activity.id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Promise<Activity>;

  @ManyToOne(() => Users, (users) => users.id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create({ activityId, userId }: CreateParticipantDto): Participant {
    const participant = new Participant();
    participant.activityId = activityId;
    participant.userId = userId;
    return participant;
  }

  async getActivity(): Promise<Activity> {
    return this.activity;
  }
}
