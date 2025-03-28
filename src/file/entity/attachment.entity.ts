import { BaseEntity } from '@domain/common/base.entity';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import { Meeting } from '@domain/meeting/entity/meeting.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from '@domain/activity/entity/activity.entity';
import { Users } from '@domain/user/entity/users.entity';
import { CreateAttachmentDto } from '../dto/create.attachment.dto';

@Entity()
export class Attachment extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'attachment_id',
  })
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: FileModeEnum,
    default: FileModeEnum.local,
    nullable: false,
  })
  type: FileModeEnumType;

  @Column({
    nullable: false,
  })
  path: string;

  @Column({
    nullable: false,
  })
  deletedYn: boolean;

  @ManyToOne(() => Meeting, (meeting) => meeting.attachment, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'meeting_id' })
  meeting: Promise<Meeting>;

  @ManyToOne(() => Activity, (activity) => activity.attachment, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'activity_id' })
  activity: Promise<Activity>;

  @ManyToOne(() => Users, (Users) => Users.attachment, {
    nullable: false,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'users_id' })
  user: Promise<Users>;

  static create({ name, type, path, deletedYn }: CreateAttachmentDto): Attachment {
    const attachment = new Attachment();

    attachment.name = name;
    attachment.type = type;
    attachment.path = path;
    attachment.deletedYn = deletedYn;

    return attachment;
  }
}
