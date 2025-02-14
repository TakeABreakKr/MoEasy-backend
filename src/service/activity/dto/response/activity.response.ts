import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '@service/activity/dto/request/activity.address.dto';

export class ActivityResponse {
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
