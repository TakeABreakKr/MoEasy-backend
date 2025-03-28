import { existsSync, readFileSync, writeFileSync } from 'fs';
import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from '@file/service/file.service';
import { Attachment } from '@file/entity/attachment.entity';
import { AttachmentDao } from '@file/dao/attachment.dao.interface';
import { FileModeEnum } from '@enums/file.mode.enum';
import { ErrorMessageType } from '@enums/error.message.enum';

@Injectable()
export class LocalFileService extends FileService {
  constructor(
    private configService: ConfigService,
    @Inject('AttachmentDao') private attachmentDao: AttachmentDao,
  ) {
    super();
  }
  public async uploadAttachment(file: Express.Multer.File): Promise<string> {
    const path = await this.uploadThumbnailFile(file);

    const attachment: Attachment = await this.attachmentDao.create({
      name: file.originalname,
      type: FileModeEnum.local,
      path: path,
      deletedYn: false,
    });

    return attachment.path;
  }

  async downloadAttachment(attachmentId: number): Promise<StreamableFile | null> {
    const attachment = await this.attachmentDao.findById(attachmentId);
    if (!attachment || attachment.deletedYn) {
      throw new BadRequestException(ErrorMessageType.FILE_NOT_FOUND);
    }

    return this.getFile(attachment.path);
  }

  public async deleteAttachment(attachmentId: number): Promise<void> {
    await this.attachmentDao.delete(attachmentId);
  }

  private async uploadThumbnailFile(file: Express.Multer.File): Promise<string> {
    const path = this.configService.get('file.dir') + file.originalname;
    writeFileSync(path, file.buffer);

    return path;
  }

  private async getFile(thumbnailPath: string): Promise<StreamableFile | null> {
    if (!thumbnailPath || existsSync(thumbnailPath)) {
      return null;
    }
    return new StreamableFile(readFileSync(thumbnailPath));
  }
}
