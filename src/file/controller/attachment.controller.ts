import {
  Controller,
  Get,
  Inject,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import AuthGuard from '@root/middleware/auth/auth.guard';
import { FileService } from '@file/service/file.service.interface';
import { ApiCommonResponse } from '@decorator/api.common.response.decorator';
import { ErrorMessageType } from '@enums/error.message.enum';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard)
@ApiTags('file')
@Controller('file')
export class AttachmentController {
  constructor(@Inject('FileService') private readonly fileService: FileService) {}

  @Post('upload')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiCommonResponse()
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        thumbnail: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadAttachment(@UploadedFile() file: Express.Multer.File): Promise<number> {
    return this.fileService.uploadAttachment(file);
  }

  @Get('download')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.FILE_NOT_FOUND })
  @ApiQuery({
    name: 'attachmentId',
    type: Number,
    description: 'data required to download attachment',
  })
  async downloadAttachment(@Query('attachmentId') id: number): Promise<StreamableFile | null> {
    return this.fileService.downloadAttachment(id);
  }

  @Post('delete')
  @ApiBearerAuth(AuthGuard.ACCESS_TOKEN_HEADER)
  @ApiCommonResponse()
  @ApiUnauthorizedResponse({ status: 401, description: ErrorMessageType.NOT_EXIST_REQUESTER })
  @ApiBadRequestResponse({ status: 400, description: ErrorMessageType.FILE_NOT_FOUND })
  @ApiQuery({
    name: 'attachmentId',
    type: Number,
    description: 'data required to delete attachment',
  })
  async deleteAttachment(@Query('attachmentId') attachmentId: number): Promise<void> {
    return this.fileService.deleteAttachment(attachmentId);
  }
}
