import { ApiProperty } from '@nestjs/swagger';
import { MemberWaitingListDto } from '@service/member/dto/response/member.waiting.list.dto';

export class MemberWaitingListMeetingDto {
  @ApiProperty()
  name: string;

  @ApiProperty({
    type: MemberWaitingListDto,
    isArray: true,
  })
  members: MemberWaitingListDto[];
}
