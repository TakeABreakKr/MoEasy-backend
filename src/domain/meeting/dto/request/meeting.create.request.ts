import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class MeetingCreateRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  thumbnail: Express.Multer.File;

  @ApiProperty()
  @MaxLength(10)
  keywords: string[];

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number;

  @ApiProperty()
  members: number[];
}
