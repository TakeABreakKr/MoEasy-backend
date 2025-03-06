import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class MeetingUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  meeting_id: string;

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

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  publicYn: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  canJoin: boolean;
}
