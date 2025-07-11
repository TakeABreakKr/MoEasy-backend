import { Inject, Injectable } from '@nestjs/common';
import { UsersDao } from '@domain/user/dao/users.dao.interface';
import { Users } from '@domain/user/entity/users.entity';
import { UsersComponent } from '@domain/user/component/users.component.interface';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';

@Injectable()
export class UsersComponentImpl implements UsersComponent {
  constructor(@Inject('UsersDao') private usersDao: UsersDao) {}

  public async findByDiscordId(discordId: string): Promise<Users | null> {
    return this.usersDao.findByDiscordId(discordId);
  }

  public async createUsers(profile: UsersCreateDto): Promise<Users> {
    return this.usersDao.createUsers(profile);
  }

  public async findById(id: number): Promise<Users | null> {
    return this.usersDao.findById(id);
  }

  public async findByIds(userIds: number[]): Promise<Users[]> {
    return this.usersDao.findByIds(userIds);
  }
}
