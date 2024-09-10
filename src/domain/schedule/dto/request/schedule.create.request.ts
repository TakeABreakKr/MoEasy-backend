import { ApiProperty } from '@nestjs/swagger';
import { ArrayMaxSize, IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReminderEnumType } from '@enums/reminder.enum';
import { Address } from '@domain/schedule/entity/address.embedded';

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
  reminder: ReminderEnumType[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  announcement: string;

  @ApiProperty()
  @IsOptional()
  addressDTO: Address;

  @ApiProperty()
  @IsOptional()
  @IsString()
  detailAddress: string;
}
