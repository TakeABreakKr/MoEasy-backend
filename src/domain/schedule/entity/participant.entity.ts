import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Schedule } from './schedule.entity';
import { Users } from '@domain/user/entity/users.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { CreateParticipantDto } from '../dto/create.participant.dto';

@Entity()
export class Participant extends BaseEntity {
  @PrimaryColumn()
  schedule_id: number;

  @PrimaryColumn()
  users_id: number;

  @ManyToOne(() => Schedule, (schedule) => schedule.schedule_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Promise<Schedule>;

  @ManyToOne(() => Users, (users) => users.users_id, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create({ schedule_id, users_id }: CreateParticipantDto): Participant {
    const participant = new Participant();
    participant.schedule_id = schedule_id;
    participant.users_id = users_id;
    return participant;
  }
}
