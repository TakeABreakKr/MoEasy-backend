import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberManageRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  meetingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  memberId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isAccepted: boolean;
}
