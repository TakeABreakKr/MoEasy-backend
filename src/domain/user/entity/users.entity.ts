import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '@domain/meeting/entity/member.entity';
import { Participant } from '@domain/schedule/entity/participant.entity';
import { Settings } from './settings.embedded';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  users_id: number;

  @Column()
  nickname: string;

  @Column(() => Settings)
  settings: Settings;

  @OneToMany(() => Member, (member) => member.user)
  members: Promise<Member[]>;

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Promise<Participant[]>;

  @ManyToMany(() => Users, (users) => users.friends)
  @JoinTable({
    name: 'friend',
  })
  friends: Promise<Users[]>;

  async getMembers(): Promise<Member[]> {
    return this.members;
  }

  async getParticipants(): Promise<Participant[]> {
    return this.participants;
  }

  async getFriends(): Promise<Users[]> {
    return this.friends;
  }
}
