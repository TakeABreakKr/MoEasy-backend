import type { MeetingMemberDto } from './meeting.member.dto';

import { ApiProperty } from '@nestjs/swagger';

export class MeetingResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  members: MeetingMemberDto[];

  @ApiProperty()
  thumbnail?: string;
}
