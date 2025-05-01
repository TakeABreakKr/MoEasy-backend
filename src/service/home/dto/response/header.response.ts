import { ApiProperty } from '@nestjs/swagger';

export class HeaderResponse {
  @ApiProperty()
  id: number;

  @ApiProperty()
  profileImagePath: string;
}
