import { ApiProperty } from '@nestjs/swagger';
import { MeetingCategoryEnum } from '@enums/meeting.category.enum';

export class HomeCategoryDto {
  @ApiProperty({
    enum: Object.keys(MeetingCategoryEnum),
    example: MeetingCategoryEnum.CAREER,
  })
  name: string;

  @ApiProperty()
  order: number;
}
