import { ApiProperty } from '@nestjs/swagger';

export class ActivityListMeetingListDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  thumbnailId: number;
}
