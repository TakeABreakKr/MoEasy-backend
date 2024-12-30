import { Participant } from '@domain/schedule/entity/participant.entity';

export interface ParticipantDao {
  saveAll(participants: Participant[]): Promise<void>;
  findByUserIdAndScheduleId(user_id: number, schedule_id: number): Promise<Participant | null>;
  findByScheduleId(schedule_id: number): Promise<Participant[]>;
  findAllByUserId(user_id: number): Promise<Participant[]>;
  delete(user_id: number, schedule_id: number): Promise<void>;
  deleteAll(userIds: number[], scheduleId: number): Promise<void>;
}
