import { existsSync, readFileSync, writeFileSync } from 'fs';
import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from '@file/service/file.service';
import { Attachment } from '@file/entity/attachment.entity';
import { AttachmentDao } from '@file/dao/attachment.dao.interface';
import { FileModeEnum } from '@enums/file.mode.enum';
import { ErrorMessageType } from '@enums/error.message.enum';
import axios from 'axios';

@Injectable()
export class LocalFileService extends FileService {
  constructor(
    private configService: ConfigService,
    @Inject('AttachmentDao') private attachmentDao: AttachmentDao,
  ) {
    super();
  }
  public async uploadAttachment(file: Express.Multer.File): Promise<number> {
    const path = await this.uploadFile(file);

    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '').substring(0, 255);

    const attachment: Attachment = await this.attachmentDao.create({
      name: sanitizedFileName,
      type: FileModeEnum.local,
      path: path,
      deletedYn: false,
    });

    return attachment.id;
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

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.originalname) {
      throw new BadRequestException(ErrorMessageType.FILE_UPLOAD_FAILED);
    }

    const path = this.configService.get('file.dir') + file.originalname;
    writeFileSync(path, file.buffer);

    return path;
  }

  private async getFile(thumbnailPath: string): Promise<StreamableFile | null> {
    if (!thumbnailPath || !existsSync(thumbnailPath)) {
      return null;
    }
    return new StreamableFile(readFileSync(thumbnailPath));
  }

  public async uploadFromUrl(url: string): Promise<number> {
    const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    try {
      new URL(url);
    } catch (e) {
      throw new BadRequestException(ErrorMessageType.INVALID_URL_FORMAT);
    }

    try {
      const head = await axios.head(url);
      const contentType = head.headers['content-type'];

      if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        throw new BadRequestException(ErrorMessageType.INVALID_IMAGE_TYPE);
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessageType.FAILED_TO_FETCH_URL_HEADER);
    }

    const attachment: Attachment = await this.attachmentDao.create({
      name: `external_image_${Date.now()}`,
      type: FileModeEnum.external,
      path: url,
      deletedYn: false,
    });

    return attachment.id;
  }
}
