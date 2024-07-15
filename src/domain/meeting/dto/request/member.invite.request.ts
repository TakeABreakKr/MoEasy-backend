import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MemberInviteRequest {
  @ApiProperty()
  @IsNumber()
  newMemberId: number;

  @ApiProperty()
  @IsNotEmpty()
  meetingId: string;
}
