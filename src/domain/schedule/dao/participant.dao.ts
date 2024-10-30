import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findByUserIdAndScheduleId(user_id: number, schedule_id: number) {
    return await this.participantRepository.findOneBy({ schedule_id: schedule_id, users_id: user_id });
  }

  async delete(user_id: number, schedule_id: number): Promise<void> {
    await this.participantRepository.delete({ schedule_id: schedule_id, users_id: user_id });
  }
}
