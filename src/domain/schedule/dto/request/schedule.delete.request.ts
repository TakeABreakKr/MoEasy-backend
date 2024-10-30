import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ScheduleDeleteRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meeting_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number;
}
