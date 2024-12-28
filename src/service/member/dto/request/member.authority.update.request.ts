import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MemberAuthorityUpdateRequest {
  @ApiProperty()
  @IsNotEmpty()
  usersId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  meetingId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  isManager: boolean;
}
