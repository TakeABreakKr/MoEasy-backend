import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entity/users.entity';
import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';
import { UsersDao } from '@domain/user/dao/users.dao.interface';

@Injectable()
export class UsersDaoImpl implements UsersDao {
  constructor(@InjectRepository(Users) private usersRepository: Repository<Users>) {}

  public async findById(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ users_id: id });
  }

  public async findByIds(usersIds: number[]): Promise<Users[]> {
    return this.usersRepository.findBy({ users_id: In(usersIds) });
  }

  public async findByDiscordId(discord_id: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ discord_id });
  }

  public async createUsers(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = Users.create({
      discord_id: profile.id,
      username: profile.username,
      avatar: profile.avatar || '',
      email: profile.email,
      explanation: '',
      settings: {
        allowNotificationYn: false,
      },
    });
    await this.usersRepository.save(user);
    return user;
  }
}
