import { ApiProperty } from '@nestjs/swagger';
import { MemberSearchDto } from './member.search.dto';

export class MemberSearchResponse {
  @ApiProperty({
    type: MemberSearchDto,
    isArray: true,
  })
  memberList: MemberSearchDto[];
}
