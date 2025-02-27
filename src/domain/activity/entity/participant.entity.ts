import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { Users } from '@domain/user/entity/users.entity';
import { BaseEntity } from '@domain/common/base.entity';

type CreateParticipantDto = {
  activity_id: number;
  users_id: number;
};

@Entity()
export class Participant extends BaseEntity {
  @PrimaryColumn()
  activity_id: number;

  @PrimaryColumn()
  users_id: number;

  @ManyToOne(() => Activity, (activity) => activity.activity_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Promise<Activity>;

  @ManyToOne(() => Users, (users) => users.users_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create({ activity_id, users_id }: CreateParticipantDto): Participant {
    const participant = new Participant();
    participant.activity_id = activity_id;
    participant.users_id = users_id;
    return participant;
  }

  async getActivity(): Promise<Activity> {
    return this.activity;
  }
}
