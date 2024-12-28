import { Participant } from '@domain/schedule/entity/participant.entity';

export interface ParticipantComponent {
  saveAll(participants: Participant[]): Promise<void>;
  findByUserIdAndScheduleId(userId: number, scheduleId: number): Promise<Participant | null>;
  findByScheduleId(scheduleId: number): Promise<Participant[]>;
  findAllByUserId(userId: number): Promise<Participant[]>;
  delete(userId: number, scheduleId: number): Promise<void>;
  deleteAll(userIds: number[], scheduleId: number): Promise<void>;
}
