import { ApiProperty } from '@nestjs/swagger';
import { MeetingMemberDto } from '@service/meeting/dto/response/meeting.member.dto';

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

  @ApiProperty()
  canJoin: boolean;

  @ApiProperty()
  likedYn: boolean;

  @ApiProperty()
  likeCount: number;
}
