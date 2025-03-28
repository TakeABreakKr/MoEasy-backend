import { DynamicModule, Global, Module } from '@nestjs/common';
import { LocalFileService } from '@file/service/local.file.service';
import { S3FileService } from '@file/service/s3.file.service';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from '@file/entity/attachment.entity';
import { AttachmentDaoImpl } from '@file/dao/attachment.dao';

@Global()
@Module({})
export class FileModule {
  static forRoot({ fileMode }: { fileMode: FileModeEnumType }): DynamicModule {
    const fileServiceProvider = {
      provide: 'FileService',
      useClass: fileMode === FileModeEnum.local ? LocalFileService : S3FileService,
    };

    const attachmentDaoProvider = {
      provide: 'AttachmentDao',
      useClass: AttachmentDaoImpl,
    };

    const providers = [fileServiceProvider, attachmentDaoProvider];

    return {
      module: FileModule,
      imports: [TypeOrmModule.forFeature([Attachment])],

      providers,
      exports: providers,
    };
  }
}
