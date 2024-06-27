import type { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';

@Injectable()
export class UsersDao {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  async findById(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ users_id: id });
  }
}
