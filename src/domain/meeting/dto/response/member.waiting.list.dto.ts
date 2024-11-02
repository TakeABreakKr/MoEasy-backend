import { ApiProperty } from '@nestjs/swagger';

export class MemberWaitingListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  applicationMessage: string;
}