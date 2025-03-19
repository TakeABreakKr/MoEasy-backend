import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';
import { Users } from '@domain/user/entity/users.entity';

export interface UsersDao {
  findById(id: number): Promise<Users | null>;
  findByIds(userIds: number[]): Promise<Users[]>;
  findByDiscordId(discordId: string): Promise<Users | null>;
  createUsers(profile: DiscordProfileDto): Promise<Users>;
}
