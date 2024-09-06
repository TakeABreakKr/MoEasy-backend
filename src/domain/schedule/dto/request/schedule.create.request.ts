import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDate, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ScheduleCreateRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @IsOptional()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(13)
  @IsInt({ each: true })
  reminder: number[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  announcement: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detailAddress: string;
}
