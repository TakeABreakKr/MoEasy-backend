import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { S3FileService } from '@file/service/s3.file.service';
import { StreamableFile } from '@nestjs/common';

class MockConfigService extends ConfigService {
  get(key: string) {
    const config = {
      'AWS.region': 'ap-northeast-2',
      'AWS.S3_ACCESS_KEY': 'aws-s3-access-key',
      'AWS.S3_SECRET_ACCESS_KEY': 'aws-s3-secret-access-secret',
      'AWS.S3_BUCKET_NAME': 'aws-s3-bucketname',
      'AWS.bucket': 'urlBucketName',
    };

    return config[key];
  }
}

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockImplementation(() => ({
      Body: {
        transformToByteArray: async () => new Uint8Array(Buffer.from('test')),
      },
    })),
  })),

  PutObjectCommand: jest.fn(),
  GetObjectCommand: jest.fn(),
}));

describe('S3FileService', () => {
  let s3FileService: S3FileService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        S3FileService,
        {
          provide: ConfigService,
          useClass: MockConfigService,
        },
      ],
    }).compile();

    s3FileService = module.get<S3FileService>(S3FileService);
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
      filename: 'testFilenameMoeasy.jpg',
      path: '',
    };
    const path = await s3FileService.uploadAttachment(file);

    expect(path).toBe('https://s3.ap-northeast-2.amazonaws.com/urlBucketName/testFilenameMoeasy.jpg');
  });

  it('getFileTest', async () => {
    const attachmentId = 30;
    const result = await s3FileService.downloadAttachment(attachmentId);

    expect(result).toBeInstanceOf(StreamableFile);
  });

  it('getFileTest - EMPTY', async () => {
    const result = await s3FileService.downloadAttachment(999);

    expect(result).toBeNull();
  });
});
