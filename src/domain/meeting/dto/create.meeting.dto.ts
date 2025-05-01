import { MeetingCategoryEnumType } from '@enums/meeting.category.enum';

export interface CreateMeetingDto {
  name: string;
  category: MeetingCategoryEnumType;
  explanation: string;
  limit: number;
  publicYn: boolean;
  thumbnailId: number;
  thumbnailPath: string;
  canJoin: boolean;
}
