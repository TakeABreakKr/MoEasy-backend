import { ApiProperty } from '@nestjs/swagger';

export class AuthCallbackRequest {
  @ApiProperty()
  code: string;

  @ApiProperty()
  state: string;
}
