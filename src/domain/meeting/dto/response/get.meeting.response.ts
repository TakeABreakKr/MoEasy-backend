import { ApiProperty } from '@nestjs/swagger';
import { StreamableFile } from '@nestjs/common';

export class GetMeetingResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  thumbnail?: StreamableFile;
}
