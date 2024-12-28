import { ApiProperty } from '@nestjs/swagger';
import { MemberWaitingListMeetingDto } from '@service/member/dto/response/member.waiting.list.meeting.dto';

export class MemberWaitingListResponse {
  @ApiProperty({
    type: MemberWaitingListMeetingDto,
    isArray: true,
  })
  meetings: MemberWaitingListMeetingDto[];
}
