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
  thumbnailId?: number;

  @ApiProperty()
  category: string;

  @ApiProperty()
  memberCount: number;

  @ApiProperty()
  canJoin: boolean;

  @ApiProperty()
  likedYn: boolean;

  @ApiProperty()
  likeCount: number;
}
