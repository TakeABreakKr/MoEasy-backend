import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class MemberAuthorityModifyRequest {
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
  manager: boolean;
}
