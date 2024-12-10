import { ApiProperty } from '@nestjs/swagger';
import { MemberWaitingListMeetingDto } from '@domain/meeting/dto/response/member.waiting.list.meeting.dto';

export class MemberWaitingListResponse {
  @ApiProperty({
    type: MemberWaitingListMeetingDto,
    isArray: true,
  })
  meetings: MemberWaitingListMeetingDto[];
}
