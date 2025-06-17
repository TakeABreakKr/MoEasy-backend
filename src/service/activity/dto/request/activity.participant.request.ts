import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ActivityParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  activityId: number;
}
