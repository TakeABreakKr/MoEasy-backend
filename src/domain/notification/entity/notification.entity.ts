import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { Users } from '@domain/user/entity/users.entity';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'notification_id',
  })
  id: number;

  @Column()
  content: string;

  @Column({
    type: 'tinyint',
    default: false,
  })
  checkedYn: boolean;

  @Column({
    name: 'users_id',
  })
  userId: number;

  @ManyToOne(() => Users, (user) => user.notifications)
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create(content: string, userId: number) {
    const notification = new Notification();
    notification.content = content;
    notification.userId = userId;
    return notification;
  }

  //only use for test
  static createForTest(notificationId: number, content: string, userId: number) {
    const notification = this.create(content, userId);
    notification.id = notificationId;
    notification.checkedYn = false;
    return notification;
  }

  check() {
    this.checkedYn = true;
  }
}
