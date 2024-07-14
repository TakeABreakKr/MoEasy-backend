import type { GetMeetingMemberDto } from './get.meeting.member.dto';

import { ApiProperty } from '@nestjs/swagger';

export class GetMeetingResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  members: GetMeetingMemberDto[];

  @ApiProperty()
  thumbnail?: string;
}
