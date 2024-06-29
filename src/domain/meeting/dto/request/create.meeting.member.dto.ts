import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingMemberDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  managerYn: boolean = false;
}
