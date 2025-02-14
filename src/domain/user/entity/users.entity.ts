import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '@domain/member/entity/member.entity';
import { Participant } from '@domain/activity/entity/participant.entity';
import { Notification } from '@domain/notification/entity/notification.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';
import { Settings } from './settings.embedded';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  users_id: number;

  @Column()
  discord_id: string;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  explanation: string;

  @Column(() => Settings)
  settings: Settings;

  @OneToMany(() => Member, (member) => member.user)
  members: Promise<Member[]>;

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Promise<Participant[]>;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Promise<Notification[]>;

  @ManyToMany(() => Users, (users) => users.friends)
  @JoinTable({
    name: 'friend',
  })
  friends: Promise<Users[]>;

  static create(usersCreateDto: UsersCreateDto): Users {
    const users = new Users();
    users.discord_id = usersCreateDto.discord_id;
    users.username = usersCreateDto.username;
    users.avatar = usersCreateDto.avatar;
    users.email = usersCreateDto.email;
    users.explanation = usersCreateDto.explanation;
    users.settings = Settings.create(usersCreateDto.settings);
    return users;
  }

  // use only for test
  static createForTest({ users_id, ...props }: UsersCreateDto & { users_id: number }): Users {
    const users = Users.create(props);
    users.users_id = users_id;
    return users;
  }
}
