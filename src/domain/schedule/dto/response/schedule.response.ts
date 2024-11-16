import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '@domain/schedule/dto/request/schedule.address.dto';

export class ScheduleResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  explanation: string;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  announcement: string;

  @ApiProperty()
  onlineYn: boolean;

  @ApiProperty()
  address: AddressDto;
}
