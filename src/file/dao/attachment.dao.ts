import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from '@file/entity/attachment.entity';
import { AttachmentDao } from '@file/dao/attachment.dao.interface';
import { CreateAttachmentDto } from '@file/dto/create.attachment.dto';

@Injectable()
export class AttachmentDaoImpl implements AttachmentDao {
  constructor(
    @InjectRepository(Attachment)
    private attachmentRepository: Repository<Attachment>,
  ) {}

  async save(attachments: Attachment): Promise<void> {
    await this.attachmentRepository.save(attachments);
  }

  async findById(id: number): Promise<Attachment | null> {
    return this.attachmentRepository.findOne({ where: { id } });
  }

  async delete(id: number): Promise<void> {
    const attachment = await this.attachmentRepository.findOne({ where: { id } });
    attachment.deletedYn = true;
  }

  async create(createAttachmentDto: CreateAttachmentDto): Promise<Attachment> {
    const attachment = Attachment.create(createAttachmentDto);
    await this.attachmentRepository.save(attachment);
    return attachment;
  }
}
