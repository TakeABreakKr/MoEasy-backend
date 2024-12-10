import { Meeting } from '../entity/meeting.entity';

export interface MeetingDao {
  findByMeetingId(id: number): Promise<Meeting | null>;
  findByMeetingIds(ids: number[]): Promise<Meeting[]>;
  create(props: {
    name: string;
    explanation: string;
    limit: number;
    thumbnail: string;
    canJoin: boolean;
  }): Promise<Meeting>;
  update(meeting: Meeting): Promise<void>;
  findAll(): Promise<Meeting[]>;
  delete(id: number): Promise<void>;
}
