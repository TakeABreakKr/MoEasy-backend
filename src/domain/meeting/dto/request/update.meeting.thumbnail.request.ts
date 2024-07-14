import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeetingThumbnailRequest {
  @ApiProperty()
  meetingId: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  thumbnail: Express.Multer.File;
}
