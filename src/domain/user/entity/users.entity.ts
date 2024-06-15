import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '../../meeting/entity/member.entity';
import { Participant } from '../../schedule/entity/participant.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  users_id: number;

  @Column()
  nickname: string;

  @OneToMany(() => Member, (member) => member.user)
  members: Promise<Member[]>;

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Promise<Participant[]>;
}
