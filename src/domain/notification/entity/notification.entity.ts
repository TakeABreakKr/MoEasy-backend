import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { Users } from '@domain/user/entity/users.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn()
  notification_id: number;

  @Column()
  content: string;

  @Column({
    type: 'tinyint',
    default: false,
  })
  checkedYn: boolean;

  @Column()
  users_id: number;

  @ManyToOne(() => Users, (user) => user.notifications)
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create(content: string, userId: number) {
    const notification = new Notification();
    notification.content = content;
    notification.users_id = userId;
    return notification;
  }

  //only use for test
  static createForTest(notification_id: number, content: string, userId: number) {
    const notification = this.create(content, userId);
    notification.notification_id = notification_id;
    notification.checkedYn = false;
    return notification;
  }

  check() {
    this.checkedYn = true;
  }
}
