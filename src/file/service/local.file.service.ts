import { writeFileSync } from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileService } from './file.service';

@Injectable()
export class LocalFileService extends FileService {
  constructor(private configService: ConfigService) {
    super();
  }

  uploadFile(file: Express.Multer.File): string {
    const path = this.configService.get('file.dir') + file.originalname;
    writeFileSync(path, file.buffer);

    return path;
  }
}
