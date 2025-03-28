import { BaseEntity } from '@domain/common/base.entity';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { CreateAttachmentDto } from '@file/dto/create.attachment.dto';

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

  static create({ name, type, path, deletedYn }: CreateAttachmentDto): Attachment {
    const attachment = new Attachment();

    attachment.name = name;
    attachment.type = type;
    attachment.path = path;
    attachment.deletedYn = deletedYn;

    return attachment;
  }
}
