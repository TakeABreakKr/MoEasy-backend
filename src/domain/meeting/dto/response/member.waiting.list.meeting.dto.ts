import { ApiProperty } from '@nestjs/swagger';
import { MemberWaitingListDto } from '@domain/meeting/dto/response/member.waiting.list.dto';

export class MemberWaitingListMeetingDto{
	@ApiProperty()
	name: string;

	@ApiProperty()
	members: MemberWaitingListDto[];
}
