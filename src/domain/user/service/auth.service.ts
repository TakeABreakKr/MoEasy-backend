import { Injectable } from '@nestjs/common';
import { Users } from '../entity/users.entity';
import { UsersDao } from '../dao/users.dao';
import { DiscordProfileDto } from '../dto/discord.profile.dto';

@Injectable()
export class AuthService {
  constructor(private usersDao: UsersDao) {}

  public async login() {}

  public async callback() {}

  private async getUser(profile: DiscordProfileDto): Promise<Users> {
    const user: Users = await this.usersDao.findByDiscordId(profile.id);
    if (user) {
      return user;
    }

    return this.usersDao.createUsers(profile);
  }
}
