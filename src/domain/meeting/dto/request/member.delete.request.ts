import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberDeleteRequest {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  deletedMemberId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meetingId: string;
}
