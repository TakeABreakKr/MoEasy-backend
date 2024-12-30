import { Inject, Injectable } from '@nestjs/common';
import { ParticipantComponent } from '@domain/schedule/component/participant.component.interface';
import { Participant } from '../entity/participant.entity';
import { ParticipantDao } from '@domain/schedule/dao/participant.dao.interface';

@Injectable()
export class ParticipantComponentImpl implements ParticipantComponent {
  constructor(@Inject('ParticipantDao') private participantDao: ParticipantDao) {}

  public async saveAll(participants: Participant[]): Promise<void> {
    return this.participantDao.saveAll(participants);
  }

  public async findByUserIdAndScheduleId(userId: number, scheduleId: number): Promise<Participant> {
    return this.participantDao.findByUserIdAndScheduleId(userId, scheduleId);
  }

  public async findByScheduleId(scheduleId: number): Promise<Participant[] | null> {
    return this.participantDao.findByScheduleId(scheduleId);
  }

  public async findAllByUserId(userId: number): Promise<Participant[] | null> {
    return this.participantDao.findAllByUserId(userId);
  }

  public async delete(userId: number, scheduleId: number): Promise<void> {
    return this.participantDao.delete(userId, scheduleId);
  }

  public async deleteAll(userIds: number[], scheduleId: number): Promise<void> {
    return this.participantDao.deleteAll(userIds, scheduleId);
  }
}
