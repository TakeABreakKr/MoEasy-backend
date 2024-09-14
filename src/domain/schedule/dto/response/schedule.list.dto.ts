import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

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
  Address: AddressDto; //수정

  @ApiProperty()
  announcement: string;
}
