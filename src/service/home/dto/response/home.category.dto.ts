import { ApiProperty } from '@nestjs/swagger';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export class HomeCategoryDto {
  @ApiProperty({
    enum: MeetingCategoryEnum,
    example: MeetingCategoryEnum.CAREER,
  })
  name: MeetingCategoryEnumType;

  @ApiProperty()
  order: number;
}
