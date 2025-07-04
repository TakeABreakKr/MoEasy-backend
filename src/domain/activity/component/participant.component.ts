import { Inject, Injectable } from '@nestjs/common';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

@Injectable()
export class ParticipantComponentImpl implements ParticipantComponent {
  constructor(@Inject('ParticipantDao') private participantDao: ParticipantDao) {}

  public async create(activityId: number, userId: number): Promise<Participant> {
    return this.participantDao.create(activityId, userId);
  }

  public async saveAll(participants: Participant[]): Promise<void> {
    this.participantDao.saveAll(participants);
  }

  public async findByUserIdAndActivityId(userId: number, activityId: number): Promise<Participant> {
    return this.participantDao.findByUserIdAndActivityId(userId, activityId);
  }

  public async existsParticipant(userId: number, activityId: number): Promise<boolean> {
    return this.participantDao.existsParticipant(userId, activityId);
  }

  public async findByActivityId(activityId: number): Promise<Participant[]> {
    return this.participantDao.findByActivityId(activityId);
  }

  public async findAllByUserId(userId: number): Promise<Participant[]> {
    return this.participantDao.findAllByUserId(userId);
  }

  public async getParticipantCount(activityId: number): Promise<number> {
    return this.participantDao.getParticipantCount(activityId);
  }

  public async delete(userId: number, activityId: number): Promise<void> {
    this.participantDao.delete(userId, activityId);
  }

  public async deleteAll(userIds: number[], activityId: number): Promise<void> {
    this.participantDao.deleteAll(userIds, activityId);
  }

  public async getHomeActivityParticipants(activityId: number): Promise<ActivityParticipantDto[]> {
    return this.participantDao.getHomeActivityParticipants(activityId);
  }
}
