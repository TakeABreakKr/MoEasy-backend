import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityWithdrawRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meeting_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  activityId: number;
}
