import { ApiProperty } from '@nestjs/swagger';
import { ActivityMemberDto } from './activity.member.dto';

export class ActivityResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  announcement: string;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty()
  region: string;

  @ApiProperty({
    type: ActivityMemberDto,
    isArray: true,
  })
  members: ActivityMemberDto[];
}
