import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ScheduleWithdrawRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meeting_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  schedule_id: number;
}
