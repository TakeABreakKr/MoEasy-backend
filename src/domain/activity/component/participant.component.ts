import { Inject, Injectable } from '@nestjs/common';
import { ParticipantComponent } from '@domain/activity/component/participant.component.interface';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';

@Injectable()
export class ParticipantComponentImpl implements ParticipantComponent {
  constructor(@Inject('ParticipantDao') private participantDao: ParticipantDao) {}

  public async saveAll(participants: Participant[]): Promise<void> {
    return this.participantDao.saveAll(participants);
  }

  public async findByUserIdAndActivityId(usersId: number, activityId: number): Promise<Participant> {
    return this.participantDao.findByUserIdAndActivityId(usersId, activityId);
  }

  public async findByActivityId(activityId: number): Promise<Participant[]> {
    return this.participantDao.findByActivityId(activityId);
  }

  public async findAllByUserId(usersId: number): Promise<Participant[]> {
    return this.participantDao.findAllByUserId(usersId);
  }

  public async delete(userId: number, activityId: number): Promise<void> {
    await this.participantDao.delete(userId, activityId);
  }

  public async deleteAll(userIds: number[], activityId: number): Promise<void> {
    await this.participantDao.deleteAll(userIds, activityId);
  }
}
