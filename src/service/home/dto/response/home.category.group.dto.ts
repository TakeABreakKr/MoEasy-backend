import { ApiProperty } from '@nestjs/swagger';
import { HomeCategoryDto } from '@service/home/dto/response/home.category.dto';

export class HomeCategoryGroupDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: HomeCategoryDto, isArray: true })
  homeCategoryList: HomeCategoryDto[];
}
