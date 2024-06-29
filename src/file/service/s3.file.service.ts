import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { FileService } from './file.service';

@Injectable()
export class S3FileService extends FileService {
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    super();
    this.s3Client = new S3Client({
      region: this.configService.get('AWS.region'),
      credentials: {
        accessKeyId: this.configService.get('AWS.S3_ACCESS_KEY'),
        secretAccessKey: this.configService.get('AWS.S3_SECRET_ACCESS_KEY'),
      },
    });
  }

  uploadFile(file: Express.Multer.File): string {
    const filename = file.filename;
    const ext = extname(file.originalname);
    const uploadCommand = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'), // S3 버킷 이름
      Key: filename, // 업로드될 파일의 이름
      Body: file.buffer, // 업로드할 파일
      ACL: 'public-read', // 파일 접근 권한
      ContentType: `image/${ext}`, // 파일 타입
    });

    this.s3Client.send(uploadCommand);

    const bucketName = this.configService.get('AWS.bucket');
    const region = this.configService.get('AWS.region');
    return `https://s3.${region}.amazonaws.com/${bucketName}/${filename}`;
  }
}
