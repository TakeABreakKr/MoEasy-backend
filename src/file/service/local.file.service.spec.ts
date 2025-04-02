import { Test } from '@nestjs/testing';
import { LocalFileService } from '@file/service/local.file.service';
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

  it('uploadAttachmentTest', async () => {
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
    const path = await localFileService.uploadAttachment(file);

    expect(path).toBe('/upload/MOEASY.jpg');
  });

  it('downloadAttachmentTest - NULL', async () => {
    const attachmentId = 30;
    const result = await localFileService.downloadAttachment(attachmentId);

    expect(result).toBeNull();
  });

  it('downloadAttachmentTest', async () => {
    const attachmentId = 30;
    const result = await localFileService.downloadAttachment(attachmentId);

    expect(result).toBeInstanceOf(StreamableFile);
  });
});
