import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { CreateMeetingMemberDto } from './create.meeting.member.dto';

export class CreateMeetingRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  explanation: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  @Min(1)
  limit: number;

  @ApiProperty()
  members: CreateMeetingMemberDto[];
}
