import { Inject, Injectable } from '@nestjs/common';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { Users } from '@domain/user/entity/users.entity';
import { DiscordProfileDto } from '@domain/auth/dto/discord.profile.dto';

@Injectable()
export class UsersComponentImpl implements UsersComponent {
  constructor(@Inject('UsersDao') private usersDao: UsersDao) {}

  public async findByDiscordId(discord_id: string): Promise<Users | null> {
    return this.usersDao.findByDiscordId(discord_id);
  }

  public async createUsers(profile: DiscordProfileDto): Promise<Users> {
    return this.usersDao.createUsers(profile);
  }

  public async findById(id: number): Promise<Users | null> {
    return this.usersDao.findById(id);
  }

  public async findByIds(usersIds: number[]): Promise<Users[]> {
    return this.usersDao.findByIds(usersIds);
  }
}
