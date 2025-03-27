import { Injectable } from '@nestjs/common';
import { AttachmentDao } from '@file/dao/attachment.interface';

@Injectable()
export class AttachmentDaoImpl implements AttachmentDao {}
