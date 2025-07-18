import { StreamableFile } from '@nestjs/common';

export abstract class FileService {
  abstract uploadAttachment(file: Express.Multer.File): Promise<number>;
  abstract downloadAttachment(id: number): Promise<StreamableFile | null>;
  abstract deleteAttachment(id: number): Promise<void>;
  abstract uploadFromUrl(url: string): Promise<number>;
}
