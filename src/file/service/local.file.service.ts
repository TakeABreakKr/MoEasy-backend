import { existsSync, readFileSync, writeFileSync } from 'fs';
import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from './file.service';

@Injectable()
export class LocalFileService extends FileService {
  constructor(private configService: ConfigService) {
    super();
  }

  async uploadThumbnailFile(file: Express.Multer.File): Promise<string> {
    const path = this.configService.get('file.dir') + file.originalname;
    writeFileSync(path, file.buffer);

    return path;
  }

  async getFile(thumbnailPath: string): Promise<StreamableFile | null> {
    if (!thumbnailPath || existsSync(thumbnailPath)) {
      return null;
    }

    return new StreamableFile(readFileSync(thumbnailPath));
  }
}
