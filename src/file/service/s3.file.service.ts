import { Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { FileService } from './file.service';

@Injectable()
export class S3FileService extends FileService {
  private s3Client: S3Client;
  private readonly awsS3BucketName: string;

  constructor(private configService: ConfigService) {
    super();
    this.s3Client = new S3Client({
      region: configService.get('AWS.region'),
      credentials: {
        accessKeyId: configService.get('AWS.S3_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS.S3_SECRET_ACCESS_KEY'),
      },
    });
    this.awsS3BucketName = configService.get('AWS_S3_BUCKET_NAME');
  }

  async uploadThumbnailFile(file: Express.Multer.File): Promise<string> {
    const filename = file.filename;
    const ext = extname(file.originalname);
    const uploadCommand = new PutObjectCommand({
      Bucket: this.awsS3BucketName, // S3 버킷 이름
      Key: filename, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    await this.s3Client.send(uploadCommand);

    const urlBucketName = this.configService.get('AWS.bucket');
    const region = this.configService.get('AWS.region');
    return `https://s3.${region}.amazonaws.com/${urlBucketName}/${filename}`;
  }

  async getFile(path: string): Promise<StreamableFile | null> {
    if (!path) {
      return null;
    }

    const downloadCommand = new GetObjectCommand({
      Bucket: this.awsS3BucketName,
      Key: path,
    });

    const file: Uint8Array = await (await this.s3Client.send(downloadCommand)).Body.transformToByteArray();
    return new StreamableFile(file);
  }
}
