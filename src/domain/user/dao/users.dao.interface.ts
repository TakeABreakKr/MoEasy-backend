import { Users } from '@domain/user/entity/users.entity';
import { UsersCreateDto } from '@domain/user/dto/users.create.dto';

export interface UsersDao {
  findById(id: number): Promise<Users | null>;
  findByIds(userIds: number[]): Promise<Users[]>;
  findByDiscordId(discordId: string): Promise<Users | null>;
  createUsers(profile: UsersCreateDto): Promise<Users>;
}
