import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMeetingRequest {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
