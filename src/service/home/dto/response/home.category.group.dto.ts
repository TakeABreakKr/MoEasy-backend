import { ApiProperty } from '@nestjs/swagger';
import { HomeCategoryDto } from '@service/home/dto/response/home.category.dto';
import { MeetingCategoryGroupEnum, MeetingCategoryGroupEnumType } from '@enums/meeting.category.group.enum';

export class HomeCategoryGroupDto {
  @ApiProperty({ enum: MeetingCategoryGroupEnum, example: MeetingCategoryGroupEnum.ACTIVITY })
  name: MeetingCategoryGroupEnumType;

  @ApiProperty({ type: HomeCategoryDto, isArray: true })
  homeCategoryList: HomeCategoryDto[];
}
