import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateMeetingRequest {
  @ApiProperty()
  @IsNotEmpty()
  meeting_id: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number = 10;
}
