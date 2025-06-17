import { ApiProperty } from '@nestjs/swagger';
import { AuthorityEnumType } from '@enums/authority.enum';

export class MemberResponse {
  @ApiProperty()
  username: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  authority: AuthorityEnumType; //이거 기획에 따라 삭제될수도
  //TODO : 친구 api 개발 후 친구 코드 추가
}
