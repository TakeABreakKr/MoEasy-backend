import { ApiProperty } from '@nestjs/swagger';

export class CreateMeetingMemberDto {
  @ApiProperty()
  managerYn: boolean;
}
