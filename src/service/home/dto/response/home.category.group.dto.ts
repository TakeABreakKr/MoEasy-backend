import { ApiProperty } from '@nestjs/swagger';
import { HomeCategoryDto } from '@service/home/dto/response/home.category.dto';
import { MeetingCategoryGroupEnum } from '@enums/meeting.category.group.enum';

export class HomeCategoryGroupDto {
  @ApiProperty({ type: Object.keys(MeetingCategoryGroupEnum), example: MeetingCategoryGroupEnum.ACTIVITY })
  name: string;

  @ApiProperty({ type: HomeCategoryDto, isArray: true })
  homeCategoryList: HomeCategoryDto[];
}
