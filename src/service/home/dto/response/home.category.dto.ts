import { ApiProperty } from '@nestjs/swagger';

export class HomeCategoryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  order: number;
}
