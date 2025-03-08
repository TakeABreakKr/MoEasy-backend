import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participant } from '../entity/participant.entity';
import { Users } from '@domain/user/entity/users.entity';

@Injectable()
export class ParticipantDao {
  constructor(@InjectRepository(Participant) private participantRepository: Repository<Participant>) {}

  async saveAll(participants: Participant[]): Promise<void> {
    await this.participantRepository.save(participants);
  }

  async findByUserIdAndActivityId(userId: number, activityId: number): Promise<Participant | null> {
    return this.participantRepository.findOneBy({ activityId, userId });
  }

  async findByActivityId(activityId: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ activityId });
  }

  async findAllByUserId(userId: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ userId });
  }

  async getParticipantCount(activityId: number): Promise<number> {
    return this.participantRepository.count({ where: { activityId } });
  }

  async delete(userId: number, activityId: number): Promise<void> {
    await this.participantRepository.delete({ activityId, userId });
  }

  async deleteAll(userIds: number[], activityId: number): Promise<void> {
    await this.participantRepository.delete({
      activityId,
      userId: In(userIds),
    });
  }

  async getParticipantThumbnailUrls(activityId: number): Promise<string[]> {
    return this.participantRepository
      .createQueryBuilder()
      .select('user.thumbnail')
      .from(Participant, 'participant')
      .leftJoin(Users, 'user', 'user.users_id = participant.users_id')
      .where('participant.activity_id = :activityId', { activityId })
      .getRawMany()
      .then((results) => results.filter((result) => result.thumbnail !== null).map((result) => result.thumbnail));
  }
}
