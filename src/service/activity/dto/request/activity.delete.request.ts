import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivityDeleteRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  activityId: number;
}
