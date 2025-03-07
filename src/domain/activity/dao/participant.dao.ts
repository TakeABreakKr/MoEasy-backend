import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';

@Injectable()
export class ParticipantDaoImpl implements ParticipantDao {
  constructor(@InjectRepository(Participant) private participantRepository: Repository<Participant>) {}

  async saveAll(participants: Participant[]): Promise<void> {
    await this.participantRepository.save(participants);
  }

  async findByUserIdAndActivityId(users_id: number, activity_id: number): Promise<Participant | null> {
    return this.participantRepository.findOneBy({ users_id, activity_id });
  }

  async findByActivityId(activity_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ activity_id });
  }

  async findAllByUserId(users_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ users_id });
  }

  async delete(users_id: number, activity_id: number): Promise<void> {
    await this.participantRepository.delete({ activity_id, users_id });
  }

  async deleteAll(userIds: number[], activity_id: number): Promise<void> {
    await this.participantRepository.delete({ users_id: In(userIds), activity_id });
  }
}
