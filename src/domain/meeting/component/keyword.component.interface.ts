import { Keyword } from '@domain/meeting/entity/keyword.entity';

export interface KeywordComponent {
  countByMeetingId(meetingId: number): Promise<number>;
  saveAll(keywords: Keyword[]): Promise<void>;
}
