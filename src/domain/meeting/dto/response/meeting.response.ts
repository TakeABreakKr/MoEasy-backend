import { ApiProperty } from '@nestjs/swagger';
import { MeetingMemberDto } from './meeting.member.dto';

export class MeetingResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  limit: number;

  @ApiProperty({
    type: MeetingMemberDto,
    isArray: true,
  })
  members: MeetingMemberDto[];

  @ApiProperty()
  thumbnail?: string;
}
