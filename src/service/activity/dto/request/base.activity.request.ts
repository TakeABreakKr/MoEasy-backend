import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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
  reminder: ReminderEnumType[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  announcement: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  onlineYn: boolean;

  @ApiProperty({
    type: AddressDto,
  })
  @IsOptional()
  address: AddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detailAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  participantLimit: number;

  @ApiProperty()
  participants: number[];
}
