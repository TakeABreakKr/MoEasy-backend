import { BadRequestException, Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { extname } from 'path';
import { FileService } from '@file/service/file.service';
import { AttachmentDao } from '@file/dao/attachment.dao.interface';
import { ErrorMessageType } from '@enums/error.message.enum';
import { FileModeEnum, FileModeEnumType } from '@enums/file.mode.enum';
import axios from 'axios';
import { Attachment } from '@file/entity/attachment.entity';

@Injectable()
export class S3FileService implements FileService {
  private s3Client: S3Client;
  private readonly awsS3BucketName: string;

  constructor(
    private configService: ConfigService,
    @Inject('AttachmentDao') private attachmentDao: AttachmentDao,
  ) {
    this.s3Client = new S3Client({
      region: configService.get('AWS.region'),
      credentials: {
        accessKeyId: configService.get('AWS.S3_ACCESS_KEY'),
        secretAccessKey: configService.get('AWS.S3_SECRET_ACCESS_KEY'),
      },
    });
    this.awsS3BucketName = configService.get('AWS_S3_BUCKET_NAME');
  }

  public async uploadAttachmentAndGetPath(file: Express.Multer.File): Promise<string> {
    const { path } = await this.uploadAttachment(file);
    return path;
  }

  public async uploadAttachment(file: Express.Multer.File): Promise<{ id: number; path: string }> {
    const { attachment, path } = await this.prepareAndCreateAttachment(file);

    return {
      id: attachment.id,
      path: path,
    };
  }

  private async prepareAndCreateAttachment(file: Express.Multer.File): Promise<{
    path: string;
    attachment: Attachment;
  }> {
    const path = await this.uploadFile(file);
    const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 255);

    const attachment = await this.attachmentDao.create({
      name: sanitizedFileName,
      type: FileModeEnum.s3,
      path: path,
      deletedYn: false,
    });

    return { path, attachment };
  }

  public async downloadAttachment(id: number): Promise<StreamableFile | null> {
    const attachment = await this.attachmentDao.findById(id);
    if (!attachment || attachment.deletedYn) {
      throw new BadRequestException(ErrorMessageType.FILE_NOT_FOUND);
    }

    return this.getFile(attachment.type, attachment.path);
  }

  public async deleteAttachment(attachmentId: number): Promise<void> {
    const attachment = await this.attachmentDao.findById(attachmentId);
    if (attachment && !attachment.deletedYn) {
      const key = attachment.path.split('/').pop();
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.awsS3BucketName,
        Key: key,
      });
      await this.s3Client.send(deleteCommand);

      await this.attachmentDao.delete(attachmentId);
    }
  }

  private async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file || !file.originalname) {
      throw new BadRequestException(ErrorMessageType.FILE_UPLOAD_FAILED);
    }

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

  private async getFile(type: FileModeEnumType, path: string): Promise<StreamableFile | null> {
    if (!path) {
      return null;
    }

    let content: Buffer | Uint8Array;

    if (type == FileModeEnum.external) {
      const response = await axios.get(path, { responseType: 'arraybuffer' });
      content = response.data;
    }

    if (type == FileModeEnum.s3) {
      const downloadCommand = new GetObjectCommand({
        Bucket: this.awsS3BucketName,
        Key: path,
      });

      content = await (await this.s3Client.send(downloadCommand)).Body.transformToByteArray();
    }

    return new StreamableFile(content);
  }

  public async uploadFromUrl(url: string): Promise<{ id: number; path: string }> {
    const file = await this.prepareFromUrl(url);
    const { id, path } = await this.uploadAttachment(file);

    return { id, path };
  }

  private async prepareFromUrl(url: string): Promise<Express.Multer.File> {
    const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    try {
      new URL(url);
    } catch (e) {
      throw new BadRequestException(ErrorMessageType.INVALID_URL_FORMAT);
    }

    let contentType: string;
    try {
      const head = await axios.head(url);
      contentType = head.headers['content-type'];

      if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
        throw new BadRequestException(ErrorMessageType.INVALID_IMAGE_TYPE);
      }
    } catch (e) {
      throw new BadRequestException(ErrorMessageType.FAILED_TO_FETCH_URL_HEADER);
    }

    const ext = contentType.split('/').pop();
    const filename = `external_image_${Date.now()}.${ext}`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      maxContentLength: MAX_FILE_SIZE,
    });

    return {
      originalname: filename,
      buffer: response.data,
      fieldname: 'avatar',
      mimetype: contentType,
      size: response.data.length,
      encoding: '7bit',
      filename: filename,
      stream: null,
      destination: '',
      path: '',
    };
  }
}
