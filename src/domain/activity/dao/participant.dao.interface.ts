import { Participant } from '@domain/activity/entity/participant.entity';

export interface ParticipantDao {
  saveAll(participants: Participant[]): Promise<void>;
  findByUserIdAndActivityId(user_id: number, activity_id: number): Promise<Participant | null>;
  findByActivityId(activity_id: number): Promise<Participant[]>;
  findAllByUserId(user_id: number): Promise<Participant[]>;
  delete(user_id: number, activity_id: number): Promise<void>;
  deleteAll(userIds: number[], activity_id: number): Promise<void>;
}
