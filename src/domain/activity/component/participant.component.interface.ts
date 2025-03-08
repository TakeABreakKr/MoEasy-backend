import { Participant } from '@domain/activity/entity/participant.entity';

export interface ParticipantComponent {
  saveAll(participants: Participant[]): Promise<void>;
  findByUserIdAndActivityId(userId: number, activityId: number): Promise<Participant | null>;
  findByActivityId(activityId: number): Promise<Participant[]>;
  findAllByUserId(userId: number): Promise<Participant[]>;
  getParticipantCount(activityId: number): Promise<number>;
  delete(userId: number, activityId: number): Promise<void>;
  deleteAll(userIds: number[], activityId: number): Promise<void>;
  getParticipantThumbnailUrls(activityId: number): Promise<string[]>;
}
