import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenRequest {
  @ApiProperty()
  refreshToken: string;
}
