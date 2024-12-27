import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Participant } from '../entity/participant.entity';

@Injectable()
export class ParticipantDao {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  async saveAll(participants: Participant[]): Promise<void> {
    await this.participantRepository.save(participants);
  }

  async findByUserIdAndScheduleId(user_id: number, schedule_id: number): Promise<Participant | null> {
    return this.participantRepository.findOneBy({ schedule_id: schedule_id, users_id: user_id });
  }

  async findByScheduleId(schedule_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ schedule_id: schedule_id });
  }

  async findAllByUserId(user_id: number): Promise<Participant[]> {
    return this.participantRepository.findBy({ users_id: user_id });
  }

  async delete(user_id: number, schedule_id: number): Promise<void> {
    await this.participantRepository.delete({ schedule_id: schedule_id, users_id: user_id });
  }

  async deleteAll(userIds: number[], scheduleId: number): Promise<void> {
    await this.participantRepository.delete({ users_id: In(userIds), schedule_id: scheduleId });
  }
}
