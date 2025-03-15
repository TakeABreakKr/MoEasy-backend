import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Member } from '@domain/member/entity/member.entity';
import { Participant } from '@domain/activity/entity/participant.entity';
import { Notification } from '@domain/notification/entity/notification.entity';
import { BaseEntity } from '@domain/common/base.entity';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';
import { Settings } from '@domain/user/entity/settings.embedded';
import { MeetingLike } from '@domain/meeting/entity/meeting.like.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'users_id',
  })
  id: number;

  @Column({
    name: 'discord_id',
  })
  discordId: string;

  @Column()
  username: string;

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  explanation: string;

  @Column()
  thumbnail: string;

  @Column(() => Settings)
  settings: Settings;

  @OneToMany(() => Member, (member) => member.user)
  members: Promise<Member[]>;

  @OneToMany(() => Participant, (participant) => participant.user)
  participants: Promise<Participant[]>;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Promise<Notification[]>;

  @OneToMany(() => MeetingLike, (meetingLike) => meetingLike.user)
  meetingLikes: Promise<MeetingLike[]>;

  @ManyToMany(() => Users, (users) => users.friends)
  @JoinTable({
    name: 'friend',
  })
  friends: Promise<Users[]>;

  static create(usersCreateDto: UsersCreateDto): Users {
    const users = new Users();
    users.discordId = usersCreateDto.discordId;
    users.username = usersCreateDto.username;
    users.avatar = usersCreateDto.avatar;
    users.email = usersCreateDto.email;
    users.explanation = usersCreateDto.explanation;
    users.thumbnail = usersCreateDto.thumbnail;
    users.settings = Settings.create(usersCreateDto.settings);
    return users;
  }

  // use only for test
  static createForTest({ id, ...props }: UsersCreateDto & { id: number }): Users {
    const users = Users.create(props);
    users.id = id;
    return users;
  }
}
