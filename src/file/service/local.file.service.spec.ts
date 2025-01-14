import { Test } from '@nestjs/testing';
import { LocalFileService } from './local.file.service';
import { ConfigService } from '@nestjs/config';
import { StreamableFile } from '@nestjs/common';

class MockConfigService extends ConfigService {
  get(key: string) {
    const config = { 'file.dir': '/upload/' };
    return config[key];
  }
}

const mockFiles: { [key: string]: Buffer } = {};

jest.mock('fs', () => ({
  writeFileSync: (path: string, data: Buffer) => {
    mockFiles[path] = data;
  },

  existsSync: (path: string) => {
    return path.includes('MOEASY.jpg');
  },

  readFileSync: (path: string) => {
    return mockFiles[path];
  },
}));

describe('LocalFileService', () => {
  let localFileService: LocalFileService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        LocalFileService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    localFileService = module.get<LocalFileService>(LocalFileService);
  });

  it('uploadThumbnailFileTest', async () => {
    const file = {
      fieldname: 'thumbnail',
      originalname: 'MOEASY.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1234,
      buffer: Buffer.from('test'),
      stream: undefined,
      destination: '',
      filename: '',
      path: '',
    };
    const path = await localFileService.uploadThumbnailFile(file);

    expect(path).toBe('/upload/MOEASY.jpg');
  });

  it('getFileTest - NULL', async () => {
    const thumbnailPath = '/upload/MOEASY.jpg';
    const result = await localFileService.getFile(thumbnailPath);

    expect(result).toBeNull();
  });

  it('getFileTest - StreamableFile', async () => {
    const nonExistingPath = '/upload/nonexistent.jpg';
    mockFiles[nonExistingPath] = Buffer.from('test content');
    const result = await localFileService.getFile(nonExistingPath);

    expect(result).toBeInstanceOf(StreamableFile);
  });
});
