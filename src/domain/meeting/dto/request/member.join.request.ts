import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class MemberJoinRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  joinMessage: string;
}
