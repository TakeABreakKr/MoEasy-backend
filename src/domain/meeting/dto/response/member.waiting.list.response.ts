import { ApiProperty } from '@nestjs/swagger';
import { MemberWaitingListMeetingDto } from '@domain/meeting/dto/response/member.waiting.list.meeting.dto';
import { isArray } from 'class-validator';

export class MemberWaitingListResponse {
	@ApiProperty({
		type: MemberWaitingListMeetingDto,
		isArray: true,
	})
	meetings: MemberWaitingListMeetingDto[]
}
