import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participant } from '../entity/participant.entity';

@Injectable()
export class ParticipantDao {
  constructor(@InjectRepository(Participant) private participantRepository: Repository<Participant>) {}

  async saveAll(participants: Participant[]): Promise<void> {
    await this.participantRepository.save(participants);
  }

  async findByUserIdAndActivityId(user_id: number, activity_id: number): Promise<Participant | null> {
    return this.participantRepository.findOneBy({ activity_id: activity_id, users_id: user_id });
  }

  async findByActivityId(activity_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ activity_id });
  }

  async findAllByUserId(user_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ users_id: user_id });
  }

  async getParticipantCount(activity_id: number): Promise<number> {
    return this.participantRepository.count({ where: { activity_id } });
  }

  async delete(users_id: number, activity_id: number): Promise<void> {
    await this.participantRepository.delete({ activity_id, users_id });
  }

  async deleteAll(userIds: number[], activity_id: number): Promise<void> {
    await this.participantRepository.delete({ users_id: In(userIds), activity_id });
  }

  async getParticipantThumbnailUrls(activity_id: number): Promise<string[]> {
    return this.participantRepository
      .createQueryBuilder()
      .select('user.thumbnail')
      .from(Participant, 'participant')
      .leftJoin('users', 'user', 'user.users_id = participant.users_id')
      .where('participant.activity_id = :activity_id', { activity_id })
      .getRawMany<string>();
  }
}
