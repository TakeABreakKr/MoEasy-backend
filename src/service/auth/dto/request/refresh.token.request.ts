import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class RefreshTokenRequest {
  @ApiProperty()
  @IsDefined()
  @IsString()
  refreshToken: string;
}
