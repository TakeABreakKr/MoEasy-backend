import type { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}
