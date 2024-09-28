import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReminderEnumType } from '@enums/reminder.enum';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export class ScheduleUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  meeting_id: string;

  @ApiProperty()
  @IsNotEmpty()
  schedule_id: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsOptional()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsOptional()
  reminder: ReminderEnumType[];

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  online: boolean;

  @ApiProperty()
  @IsOptional()
  addressDto: Address;

  @ApiProperty()
  @IsOptional()
  announcement: string;
}
