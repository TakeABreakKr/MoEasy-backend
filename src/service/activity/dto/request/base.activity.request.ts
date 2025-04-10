import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { ReminderEnumType } from '@enums/reminder.enum';
import { AddressDto } from '@service/activity/dto/request/activity.address.dto';

export abstract class ActivityRequest {
  @ApiProperty()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  @IsNotEmpty()
  thumbnail: Express.Multer.File;

  @ApiProperty({
    type: String,
    format: 'binary',
  })
  @IsNotEmpty()
  announcementImage: Express.Multer.File;

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
  reminder: ReminderEnumType[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  announcement: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  onlineYn: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @ValidateIf((request: ActivityRequest) => request.onlineYn === true)
  @IsNotEmpty()
  onlineLink: string;

  @ApiProperty({
    type: AddressDto,
  })
  @IsOptional()
  @ValidateIf((request: ActivityRequest) => request.onlineYn === false)
  address: AddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @ValidateIf((request: ActivityRequest) => request.onlineYn === false)
  detailAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  participantLimit: number;

  @ApiProperty()
  participants: number[];
}
