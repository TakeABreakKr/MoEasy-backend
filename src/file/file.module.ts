import { DynamicModule, Global, Module } from '@nestjs/common';
import { LocalFileService } from './service/local.file.service';
import { S3FileService } from './service/s3.file.service';
import { FileModeEnum, FileModeEnumType } from '../enums/file.mode.enum';

@Global()
@Module({})
export class FileModule {
  static forRoot({ fileMode }: { fileMode: FileModeEnumType }): DynamicModule {
    switch (fileMode) {
      case FileModeEnum.local: {
        const providers = [
          {
            provide: 'FileService',
            useValue: LocalFileService,
          },
        ];

        return {
          module: FileModule,
          providers,
          exports: providers,
        };
      }
      case FileModeEnum.s3: {
        const providers = [
          {
            provide: 'FileService',
            useValue: S3FileService,
          },
        ];

        return {
          module: FileModule,
          providers,
          exports: providers,
        };
      }
    }
  }
}
