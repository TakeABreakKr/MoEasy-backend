import { DynamicModule, Global, Module } from '@nestjs/common';
import { LocalFileService } from '@file/service/local.file.service';
import { S3FileService } from '@file/service/s3.file.service';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from '@file/entity/attachment.entity';

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
          imports: [TypeOrmModule.forFeature([Attachment])],
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
          imports: [TypeOrmModule.forFeature([Attachment])],
          providers,
          exports: providers,
        };
      }
    }
  }
}
