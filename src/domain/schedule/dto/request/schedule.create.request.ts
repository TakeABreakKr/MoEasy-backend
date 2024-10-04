import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReminderEnumType } from '@enums/reminder.enum';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export class ScheduleCreateRequest {
  @ApiProperty()
  @IsNotEmpty()
  meeting_id: string;

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
  online: boolean;

  @ApiProperty({
    type: AddressDto,
  })
  @IsOptional()
  address: AddressDto;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detailAddress: string;
}
