import { ApiProperty } from '@nestjs/swagger';

export class NotificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;
}
