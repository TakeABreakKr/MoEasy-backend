import { ApiProperty } from '@nestjs/swagger';
import { addressDto } from '@domain/schedule/dto/request/schedule.address';

export class ScheduleListDto {
  @ApiProperty()
  meetingId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  online: boolean;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  Address: addressDto; //수정

  @ApiProperty()
  announcement: string;
}
