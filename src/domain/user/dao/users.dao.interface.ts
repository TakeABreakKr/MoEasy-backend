import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';
import { Users } from '../entity/users.entity';

export interface UsersDao {
  findById(id: number): Promise<Users | null>;
  findByIds(userIds: number[]): Promise<Users[]>;
  findByDiscordId(discord_id: string): Promise<Users | null>;
  createUsers(profile: DiscordProfileDto): Promise<Users>;
}
