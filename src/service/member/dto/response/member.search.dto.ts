import { ApiProperty } from '@nestjs/swagger';

export class MemberSearchDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  nickname: string;
}
