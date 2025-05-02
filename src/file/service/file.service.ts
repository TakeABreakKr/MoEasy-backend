import { StreamableFile } from '@nestjs/common';

export interface FileService {
  uploadAttachmentAndGetPath(file: Express.Multer.File): Promise<string>;
  uploadAttachment(file: Express.Multer.File): Promise<{ id: number; path: string }>;
  downloadAttachment(id: number): Promise<StreamableFile | null>;
  deleteAttachment(id: number): Promise<void>;
  uploadFromUrl(url: string): Promise<{ id: number; path: string }>;
}
