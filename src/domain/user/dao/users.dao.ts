import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '@domain/user/entity/users.entity';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';

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

  public async createUsers(profile: UsersCreateDto): Promise<Users> {
    const user: Users = Users.create({
      discordId: profile.discordId,
      username: profile.username,
      email: profile.email,
      explanation: '',
      profileImageId: profile.profileImageId,
      profileImagePath: profile.profileImagePath,
      settings: {
        allowNotificationYn: false,
      },
    });

    await this.usersRepository.save(user);
    return user;
  }
}
