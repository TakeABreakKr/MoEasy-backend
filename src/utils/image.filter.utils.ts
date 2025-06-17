import { BadRequestException } from '@nestjs/common';
import { ErrorMessageType } from '@enums/error.message.enum';

export class ImageFileFilter {
  public static filter(req, file: Express.Multer.File, callback: (error: Error, acceptFile: boolean) => void): void {
    if (!file.mimetype.match(/^image\/(jpeg|png|gif|webp)$/)) {
      return callback(new BadRequestException(ErrorMessageType.INVALID_IMAGE_TYPE), false);
    }
    callback(null, true);
  }
}
