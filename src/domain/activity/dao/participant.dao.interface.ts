import { Participant } from '@domain/activity/entity/participant.entity';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

export interface ParticipantDao {
  saveAll(participants: Participant[]): Promise<void>;
  findByUserIdAndActivityId(userId: number, activityId: number): Promise<Participant | null>;
  findByActivityId(activityId: number): Promise<Participant[]>;
  findAllByUserId(userId: number): Promise<Participant[]>;
  delete(userId: number, activityId: number): Promise<void>;
  deleteAll(userIds: number[], activityId: number): Promise<void>;
  getHomeActivityParticipants(activityId: number): Promise<ActivityParticipantDto[]>;
  getParticipantCount(activityId: number): Promise<number>;
}
