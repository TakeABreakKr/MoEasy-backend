import { Users } from '@domain/user/entity/users.entity';
import { DiscordProfileDto } from '@domain/auth/dto/discord.profile.dto';

export interface UsersComponent {
  findByDiscordId(discord_id: string): Promise<Users | null>;
  createUsers(profile: DiscordProfileDto): Promise<Users>;
  findById(id: number): Promise<Users | null>;
  findByIds(usersIds: number[]): Promise<Users[]>;
}
