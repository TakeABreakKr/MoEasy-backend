import { ApiProperty } from '@nestjs/swagger';

export class ScheduleListMeetingListDto{
	@ApiProperty()
	name: string;

	@ApiProperty()
	thumbnail: string;
}