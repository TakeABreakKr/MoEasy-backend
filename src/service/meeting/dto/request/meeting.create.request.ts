import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export class MeetingCreateRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum(MeetingCategoryEnum)
  category: MeetingCategoryEnumType;

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
  @IsBoolean()
  publicYn: boolean;

  @ApiProperty()
  members: number[];

  @ApiProperty()
  @IsBoolean()
  canJoin: boolean = true;
}
