import { StreamableFile } from '@nestjs/common';

export abstract class FileService {
  abstract uploadThumbnailFile(file: Express.Multer.File): Promise<string>;
  abstract getFile(thumbnail: string): Promise<StreamableFile | null>;
}
