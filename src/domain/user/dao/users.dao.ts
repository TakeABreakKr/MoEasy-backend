import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';
import { UsersDao } from '@domain/user/dao/users.dao.interface';

@Injectable()
export class UsersDaoImpl implements UsersDao {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private configService: ConfigService,
  ) {}

  public async findById(id: number): Promise<Users | null> {
    return this.usersRepository.findOneBy({ id });
  }

  public async findByIds(userIds: number[]): Promise<Users[]> {
    return this.usersRepository.findBy({ id: In(userIds) });
  }

  public async findByDiscordId(discordId: string): Promise<Users | null> {
    return this.usersRepository.findOneBy({ discordId });
  }

  public async createUsers(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = Users.create({
      discordId: profile.id,
      username: profile.username,
      avatar: profile.avatar || '',
      email: profile.email,
      explanation: '',
      profileImageId: profile.profileImageId,
      settings: {
        allowNotificationYn: false,
      },
    });

    await this.usersRepository.save(user);
    return user;
  }
}
