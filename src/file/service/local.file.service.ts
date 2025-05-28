import { existsSync, readFileSync, writeFileSync } from 'fs';
import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from '@file/service/file.service';
import { AttachmentDao } from '@file/dao/attachment.dao.interface';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import { ErrorMessageType } from '@enums/error.message.enum';
import axios, { AxiosResponse } from 'axios';
import { Attachment } from '@file/entity/attachment.entity';

@Injectable()
export class LocalFileService implements FileService {
  constructor(
    private configService: ConfigService,
    @Inject('AttachmentDao') private attachmentDao: AttachmentDao,
  ) {}

  public async findById(attachmentId: number): Promise<Attachment | null> {
    const attachment = await this.attachmentDao.findById(attachmentId);
    if (!attachment || attachment.deletedYn) {
      throw new BadRequestException(ErrorMessageType.FILE_NOT_FOUND);
    }
    return attachment;
  }

  public async uploadAttachmentAndGetPath(file: Express.Multer.File): Promise<string> {
    const { path } = await this.uploadAttachment(file);
    return path;
  }

  public async uploadAttachment(file: Express.Multer.File): Promise<{ id: number; path: string }> {
    const { sanitizedFileName, attachment } = await this.prepareAndCreateAttachment(file);

    const host = this.configService.get('host');
    const staticPath = `${host}/static/${sanitizedFileName}`;

    return {
      id: attachment.id,
      path: staticPath,
    };
  }

  private async prepareAndCreateAttachment(file: Express.Multer.File): Promise<{
    path: string;
    sanitizedFileName: string;
    attachment: Attachment;
  }> {
    const path = await this.uploadFile(file);
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255);

    const attachment = await this.attachmentDao.create({
      name: sanitizedFileName,
      type: FileModeEnum.local,
      path: path,
      deletedYn: false,
    });

    return { path, sanitizedFileName, attachment };
  }

  public async downloadAttachment(attachmentId: number): Promise<StreamableFile | null> {
    const attachment = await this.attachmentDao.findById(attachmentId);
    if (!attachment || attachment.deletedYn) {
      throw new BadRequestException(ErrorMessageType.FILE_NOT_FOUND);
    }

    return this.getFile(attachment.type, attachment.path);
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

  private async getFile(type: FileModeEnumType, thumbnailPath: string): Promise<StreamableFile | null> {
    if (!thumbnailPath) {
      return null;
    }

    let content: Buffer | Uint8Array;

    if (type == FileModeEnum.external) {
      const response: AxiosResponse = await axios.get(thumbnailPath, { responseType: 'arraybuffer' });
      content = response.data;
    }

    if (type == FileModeEnum.local) {
      if (!existsSync(thumbnailPath)) {
        return null;
      }

      content = readFileSync(thumbnailPath);
    }

    return new StreamableFile(content);
  }

  public async uploadFromUrl(url: string): Promise<{ id: number; path: string }> {
    const { url: fileUrl, attachment } = await this.prepareFromUrl(url);

    return {
      id: attachment.id,
      path: fileUrl,
    };
  }

  private async prepareFromUrl(url: string): Promise<{ url: string; attachment: Attachment }> {
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
    const attachment = await this.attachmentDao.create({
      name: `external_image_${Date.now()}`,
      type: FileModeEnum.external,
      path: url,
      deletedYn: false,
    });

    return { url, attachment };
  }
}
