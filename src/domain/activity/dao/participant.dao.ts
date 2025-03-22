import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participant } from '@domain/activity/entity/participant.entity';
import { ParticipantDao } from '@domain/activity/dao/participant.dao.interface';
import { Users } from '@domain/user/entity/users.entity';
import { Member } from '@domain/member/entity/member.entity';
import { Activity } from '@domain/activity/entity/activity.entity';
import { ActivityParticipantDto } from '@domain/activity/dto/activity.participant.dto';

@Injectable()
export class ParticipantDaoImpl implements ParticipantDao {
  constructor(@InjectRepository(Participant) private participantRepository: Repository<Participant>) {}

  async create(activityId: number, userId: number): Promise<Participant> {
    const participant = Participant.create({ activityId, userId });
    await this.participantRepository.save(participant);

    return participant;
  }
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

  async getHomeActivityParticipants(activityId: number): Promise<ActivityParticipantDto[]> {
    return this.participantRepository
      .createQueryBuilder('participant')
      .select('user.thumbnail', 'thumbnail')
      .addSelect('member.authority', 'authority')
      .leftJoin(Users, 'user', 'user.users_id = participant.users_id')
      .leftJoin(Activity, 'activity', 'activity.activity_id = participant.activity_id')
      .leftJoin(Member, 'member', 'member.users_id = user.users_id and member.meeting_id = activity.meeting_id')
      .where('participant.activity_id = :activityId', { activityId })
      .getRawMany<ActivityParticipantDto>();
  }
}
