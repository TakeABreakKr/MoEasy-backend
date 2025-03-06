import { Keyword } from '@domain/meeting/entity/keyword.entity';

export interface KeywordDao {
  countByMeetingId(meetingId: number): Promise<number>;
  saveAll(keywords: Keyword[]): Promise<void>;
}
