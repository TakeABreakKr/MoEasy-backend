import { ApiProperty } from '@nestjs/swagger';

export class MeetingThumbnailUpdateRequest {
  @ApiProperty()
  meetingId: string;

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  thumbnail: Express.Multer.File;
}
