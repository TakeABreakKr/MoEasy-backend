import { Attachment } from '@file/entity/attachment.entity';
import { CreateAttachmentDto } from '@file/dto/create.attachment.dto';

export interface AttachmentDao {
  findById(id: number): Promise<Attachment | null>;
  delete(id: number): Promise<void>;
  save(attachments: Attachment): Promise<void>;
  create(createAttachmentDto: CreateAttachmentDto): Promise<Attachment>;
}
