import { StreamableFile } from '@nestjs/common';

export interface FileService {
  uploadAttachmentAndGetPath(file: Express.Multer.File): Promise<string>;
  uploadAttachmentAndGetId(file: Express.Multer.File): Promise<number>;
  downloadAttachment(id: number): Promise<StreamableFile | null>;
  deleteAttachment(id: number): Promise<void>;
  uploadFromUrlAndGetId(url: string): Promise<number>;
  uploadFromUrlAndGetPath(url: string): Promise<string>;
}
