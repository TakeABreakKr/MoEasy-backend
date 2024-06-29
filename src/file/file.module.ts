import { DynamicModule, Global, Module } from '@nestjs/common';
import { LocalFileService } from './service/local.file.service';

@Global()
@Module({})
export class FileModule {
  static forRoot({ fileMode }: { fileMode: 'local' | 's3' }): DynamicModule {
    switch (fileMode) {
      case 'local': {
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
      case 's3': {
        return {
          module: FileModule,
          providers: [],
          exports: [],
        };
      }
    }
  }
}
