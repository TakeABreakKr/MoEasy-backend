import { CreateMeetingDto } from '@domain/meeting/dto/create.meeting.dto';
import { Meeting } from '@domain/meeting/entity/meeting.entity';

export interface MeetingDao {
  findByMeetingId(id: number): Promise<Meeting | null>;
  findByMeetingIds(ids: number[]): Promise<Meeting[]>;
  getNewMeetings(): Promise<Meeting[]>;
  create(props: CreateMeetingDto): Promise<Meeting>;
  update(meeting: Meeting): Promise<void>;
  findAll(): Promise<Meeting[]>;
  delete(id: number): Promise<void>;
  incrementLikeCount(id: number): Promise<void>;
  decrementLikeCount(id: number): Promise<void>;
}
