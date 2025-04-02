import { StreamableFile } from '@nestjs/common';

export interface FileService {
  uploadAttachment(file: Express.Multer.File): Promise<number>;
  downloadAttachment(id: number): Promise<StreamableFile | null>;
  deleteAttachment(id: number): Promise<void>;
}
