import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class MemberApplyRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @MaxLength(100)
  applicationMessage: string;
}
